"use client";

import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateMultipleWords } from "@/feature/words/hooks/useWords";
import { ExcelWordInput } from "@/api/words.api";

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
        const parsedJson = XLSX.utils.sheet_to_json<ExcelWordInput>(ws);

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
          onError: () => {
            toast.error("Đã xảy ra lỗi khi upload dữ liệu.");
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        });
        
      } catch {
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
        title="Nhập từ Excel"
        className="flex items-center justify-center w-[38px] h-[38px] bg-white text-[#4648d4] rounded-lg shadow border border-transparent hover:border-[#4648d4] transition-all disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-[18px] h-[18px] animate-spin" />
        ) : (
          <Upload className="w-[18px] h-[18px]" />
        )}
      </button>
    </div>
  );
}
