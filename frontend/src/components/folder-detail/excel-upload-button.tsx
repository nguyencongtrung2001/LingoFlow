"use client";

import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, Loader2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useCreateMultipleWords } from "@/feature/words/hooks/useWords";

interface ExcelUploadButtonProps {
  folderId: number;
}

export function ExcelUploadButton({ folderId }: ExcelUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  
  const createMultipleMutation = useCreateMultipleWords(folderId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Chuyển sheet sang JSON
        const parsedJson = XLSX.utils.sheet_to_json<any>(ws);

        // Filter and Validate
        const validWords = parsedJson.filter(
          (row) => row.Word?.trim() && row.Meaning?.trim()
        );

        if (validWords.length === 0) {
          toast.error("File Excel không chứa dữ liệu hợp lệ! Vui lòng điền cột Word và Meaning.");
          setIsParsing(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // Call API
        createMultipleMutation.mutate(validWords, {
          onSuccess: () => {
            toast.success(`Đã thêm ${validWords.length} từ vựng từ Excel thành công!`);
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          },
          onError: (error: unknown) => {
            toast.error("Đã xảy ra lỗi khi upload dữ liệu.");
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        });
        
      } catch (error) {
        toast.error("Lỗi đọc file Excel.");
        setIsParsing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      toast.error("Không thể đọc file.");
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { Word: "hello", Meaning: "xin chào", Pos: "NOUN", Phonetic: "həˈlō", Example: "Hello there!" },
      { Word: "run", Meaning: "chạy", Pos: "VERB", Phonetic: "rən", Example: "I run fast." }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "LingoFlow_Template.xlsx");
  };

  const isPending = isParsing || createMultipleMutation.isPending;

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 bg-white text-[#4648d4] font-semibold rounded-lg shadow border border-transparent hover:border-[#4648d4] transition-all disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Upload className="w-5 h-5" />
        )}
        {isPending ? "Đang xử lý..." : "Nhập từ Excel"}
      </button>

      <button 
        onClick={handleDownloadTemplate}
        title="Tải Excel mẫu"
        className="p-2 text-gray-500 hover:text-[#4648d4] transition-colors bg-white rounded-lg shadow"
      >
        <FileDown className="w-5 h-5" />
      </button>
    </div>
  );
}
