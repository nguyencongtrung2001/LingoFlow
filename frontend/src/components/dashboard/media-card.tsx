"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IconPhoto, IconPhotoPlus, IconX, IconUpload, IconLink } from "@tabler/icons-react";

const STORAGE_KEY = "lingoflow_media_src";

export function MediaCard() {
  const [mediaSrc, setMediaSrc] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isUrlError, setIsUrlError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) setTimeout(() => setMediaSrc(s), 0);
    } catch {}
  }, []);

  const showMedia = (src: string) => {
    setMediaSrc(src);
    try {
      localStorage.setItem(STORAGE_KEY, src);
    } catch {}
  };

  const clearMedia = () => {
    setMediaSrc("");
    setUrlInput("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const applyUrl = () => {
    const val = urlInput.trim();
    if (!val) return;
    if (!/^https?:\/\//i.test(val)) {
      setIsUrlError(true);
      setTimeout(() => setIsUrlError(false), 1500);
      return;
    }
    showMedia(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (ev.target?.result) {
        showMedia(ev.target.result as string);
      }
    };
    r.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const items = e.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (f) {
            const r = new FileReader();
            r.onload = (ev) => {
              if (ev.target?.result) {
                showMedia(ev.target.result as string);
              }
            };
            r.readAsDataURL(f);
          }
          return;
        }
        if (item.kind === "string" && item.type === "text/uri-list") {
          item.getAsString((url) => {
            if (url) showMedia(url);
          });
          return;
        }
      }
    }
    const url =
      e.dataTransfer.getData("text/plain") ||
      e.dataTransfer.getData("text/uri-list");
    if (url && /^https?:\/\//i.test(url)) showMedia(url);
  };

  const isGif = mediaSrc.toLowerCase().includes(".gif") || mediaSrc.startsWith("data:image/gif");

  return (
    <div className="bg-white border-[0.5px] border-[rgba(70,69,90,0.10)] rounded-[16px] p-5 flex flex-col justify-between shadow-[0_2px_12px_-2px_rgba(70,72,212,0.04)] h-full">
      <div className="text-[11px] font-bold text-[#5f5e6e] uppercase tracking-[0.06em] flex items-center gap-[6px] mb-[0.8rem]">
        <IconPhoto className="w-[14px] h-[14px] text-[#4648d4]" />
        Ảnh / GIF học tập
      </div>

      <div
        className={`media-display-area w-full h-[125px] rounded-[10px] overflow-hidden bg-[#f0f0f6] relative flex items-center justify-center transition-colors duration-200 ${
          isDragOver ? "drag-over" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!mediaSrc ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1 text-[#9998aa] text-center cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[#d0cfe8] hover:bg-[#eeedf8] hover:border-[#4648d4] transition-colors duration-150"
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPhotoPlus className="w-[26px] h-[26px] text-[#c0bfe8]" />
            <p className="text-[12px] font-medium leading-[1.4]">
              Kéo thả ảnh / GIF vào đây<br />hoặc nhấn để chọn từ máy tính
            </p>
            <small className="text-[11px] text-[#b0afcc]">
              Hỗ trợ: JPG, PNG, GIF, WebP
            </small>
          </div>
        ) : (
          <>
            <Image
              src={mediaSrc}
              alt="Preview"
              className="w-full h-full object-cover block rounded-[10px]"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized
            />
            {isGif && (
              <div className="absolute top-2 left-2 bg-[rgba(70,72,212,0.85)] text-white text-[10px] font-bold tracking-[0.08em] py-[2px] px-[7px] rounded-[5px] pointer-events-none">
                GIF
              </div>
            )}
            <button
              className="media-remove-btn absolute top-2 right-2 w-[28px] h-[28px] rounded-full bg-[rgba(0,0,0,0.55)] text-white border-none cursor-pointer items-center justify-center z-10 transition-colors duration-150 hover:bg-[rgba(186,26,26,0.85)]"
              onClick={clearMedia}
              title="Xóa ảnh"
            >
              <IconX className="w-[14px] h-[14px]" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-[6px] mt-auto items-center pt-[10px]">
        <label
          className="w-[34px] h-[34px] rounded-[8px] border-[0.5px] border-[rgba(70,69,90,0.10)] bg-white text-[#5f5e6e] cursor-pointer flex items-center justify-center transition-all duration-150 shrink-0 hover:bg-[#eeedfe] hover:border-[#4648d4] hover:text-[#4648d4]"
          title="Tải ảnh từ máy tính"
        >
          <IconUpload className="w-[16px] h-[16px]" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.gif"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <input
          className={`flex-1 h-[34px] border-[0.5px] rounded-[8px] px-[10px] text-[12px] text-[#1a1a2e] bg-[#f8f8fc] outline-none transition-all duration-150 placeholder:text-[#9998aa] focus:border-[#4648d4] focus:shadow-[0_0_0_3px_rgba(70,72,212,0.1)] ${
            isUrlError ? "border-[#ba1a1a]" : "border-[rgba(70,69,90,0.10)]"
          }`}
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Dán link ảnh hoặc GIF (https://...)"
          onKeyDown={(e) => {
            if (e.key === "Enter") applyUrl();
          }}
        />
        <button
          className="h-[34px] px-[12px] rounded-[8px] border-[0.5px] border-[rgba(70,69,90,0.10)] bg-white text-[#5f5e6e] text-[12px] font-semibold cursor-pointer flex items-center gap-[5px] transition-all duration-150 whitespace-nowrap hover:bg-[#eeedfe] hover:border-[#4648d4] hover:text-[#4648d4]"
          onClick={applyUrl}
        >
          <IconLink className="w-[14px] h-[14px]" /> Áp dụng
        </button>
      </div>
    </div>
  );
}
