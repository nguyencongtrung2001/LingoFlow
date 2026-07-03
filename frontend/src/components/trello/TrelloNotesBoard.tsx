"use client";

import { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  StickyNote,
  AlertCircle,
} from "lucide-react";
import {
  useGetBoard,
  useCreateColumn,
  useUpdateColumn,
  useDeleteColumn,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useReorderNotes,
} from "@/feature/notes/hooks/useNotesBoard";
import type { NoteColumn, Note, ReorderItem } from "@/api/notes.api";
import { NoteEditModal } from "./NoteEditModal";

// ========== Helpers ==========

const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  const d = date;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

// ========== Sub-Components ==========

function ColumnHeader({
  column,
  notesCount,
  onRename,
  onDelete,
}: {
  column: NoteColumn;
  notesCount: number;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    if (editTitle.trim()) {
      onRename(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center mb-3 px-1">
      {isEditing ? (
        <div className="flex items-center gap-1.5 flex-1">
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className="flex-1 bg-slate-900/60 border border-slate-600/50 rounded-lg px-2 py-1 text-sm text-slate-100 outline-none focus:border-blue-500/60"
          />
          <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 p-1">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-slate-200 text-sm truncate max-w-[180px]">{column.title}</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] bg-slate-700/80 text-slate-400 px-2 py-0.5 rounded-full font-bold tabular-nums">
              {notesCount}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-700/50 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-8 z-20 bg-slate-700 border border-slate-600/50 rounded-xl shadow-xl py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setEditTitle(column.title);
                        setIsEditing(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-600/50 flex items-center gap-2 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Đổi tên
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(column.id);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa danh mục
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickAddNote({
  columnId,
  onAdd,
}: {
  columnId: string;
  onAdd: (columnId: string, title: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(columnId, title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="mt-auto pt-1">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") {
              setIsAdding(false);
              setTitle("");
            }
          }}
          placeholder="Tiêu đề ghi chú..."
          className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/60 mb-2"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            Thêm
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setTitle("");
            }}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full text-left text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 p-2 rounded-lg transition-all mt-auto flex items-center gap-1.5 cursor-pointer"
    >
      <Plus className="w-4 h-4" /> Thêm ghi chú mới
    </button>
  );
}

// ========== Main Component ==========

export default function TrelloNotesBoard() {
  const { data: serverColumns, isLoading, isError } = useGetBoard();
  const createColumnMutation = useCreateColumn();
  const updateColumnMutation = useUpdateColumn();
  const deleteColumnMutation = useDeleteColumn();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const reorderMutation = useReorderNotes();

  // Local state cho optimistic UI
  const [localColumns, setLocalColumns] = useState<NoteColumn[] | null>(null);
  const columns = localColumns ?? serverColumns ?? [];

  // Đồng bộ local state khi server data thay đổi
  const [lastServerData, setLastServerData] = useState<NoteColumn[] | null>(null);
  if (serverColumns && serverColumns !== lastServerData) {
    setLastServerData(serverColumns);
    if (!reorderMutation.isPending) {
      setLocalColumns(null);
    }
  }

  // Modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    noteId: string;
    title: string;
    content: string;
  }>({
    isOpen: false,
    noteId: "",
    title: "",
    content: "",
  });

  // New column state
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // ========== Handlers ==========

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      createColumnMutation.mutate(newColumnTitle.trim());
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleRenameColumn = (id: string, title: string) => {
    updateColumnMutation.mutate({ id, title });
  };

  const handleDeleteColumn = (id: string) => {
    deleteColumnMutation.mutate(id);
  };

  const handleAddNote = (columnId: string, title: string) => {
    createNoteMutation.mutate({ columnId, title });
  };

  const handleOpenEdit = (note: Note) => {
    setEditModal({
      isOpen: true,
      noteId: note.id,
      title: note.title,
      content: note.content || "",
    });
  };

  const handleSaveNote = (id: string, title: string, content: string) => {
    updateNoteMutation.mutate({ id, data: { title, content: content || null } });
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  // ========== Drag & Drop ==========

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Edge Case 1: Thả ra ngoài vùng hợp lệ
      if (!destination) return;

      // Không có thay đổi
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Clone columns hiện tại
      const newColumns = columns.map((col) => ({
        ...col,
        notes: [...col.notes],
      }));

      const sourceCol = newColumns.find((c) => c.id === source.droppableId);
      const destCol = newColumns.find((c) => c.id === destination.droppableId);

      if (!sourceCol || !destCol) return;

      // Gỡ note khỏi cột nguồn
      const [movedNote] = sourceCol.notes.splice(source.index, 1);
      if (!movedNote) return;

      // Gắn note vào cột đích
      movedNote.columnId = destCol.id;
      destCol.notes.splice(destination.index, 0, movedNote);

      // Cập nhật positions
      const updates: ReorderItem[] = [];

      // Cập nhật positions trong cột nguồn
      sourceCol.notes.forEach((note, idx) => {
        note.position = idx;
        updates.push({ id: note.id, position: idx, columnId: sourceCol.id });
      });

      // Cập nhật positions trong cột đích (nếu khác cột nguồn)
      if (source.droppableId !== destination.droppableId) {
        destCol.notes.forEach((note, idx) => {
          note.position = idx;
          updates.push({ id: note.id, position: idx, columnId: destCol.id });
        });
      }

      // Optimistic Update: Cập nhật UI ngay lập tức
      setLocalColumns(newColumns);

      // Gửi API request
      reorderMutation.mutate(updates, {
        onError: () => {
          // Rollback khi thất bại
          setLocalColumns(null);
        },
        onSuccess: () => {
          setLocalColumns(null);
        },
      });
    },
    [columns, reorderMutation]
  );

  // ========== Loading / Error States ==========

  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] bg-slate-900 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Đang tải bảng ghi chú...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[80vh] bg-slate-900 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400" />
          <p className="text-sm text-slate-400 font-medium">Đã xảy ra lỗi khi tải bảng ghi chú.</p>
          <p className="text-xs text-slate-500">Vui lòng kiểm tra kết nối và tải lại trang.</p>
        </div>
      </div>
    );
  }

  // ========== Main Render ==========

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-900 p-4 sm:p-6 text-white">
      {/* Board Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 max-w-full">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 select-none">
            <StickyNote className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            Sổ tay ghi chú thông minh
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kéo thả để sắp xếp • Click vào thẻ để xem chi tiết
          </p>
        </div>

        {/* Add Column Button */}
        {isAddingColumn ? (
          <div className="flex items-center gap-2 shrink-0">
            <input
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
                if (e.key === "Escape") {
                  setIsAddingColumn(false);
                  setNewColumnTitle("");
                }
              }}
              placeholder="Tên danh mục..."
              className="bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/60 w-48"
            />
            <button
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              Tạo
            </button>
            <button
              onClick={() => {
                setIsAddingColumn(false);
                setNewColumnTitle("");
              }}
              className="text-slate-500 hover:text-slate-300 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/10 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục
          </button>
        )}
      </div>

      {/* Board Body */}
      {columns.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
            <StickyNote className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-400 mb-2">Bảng ghi chú trống</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Bắt đầu bằng cách tạo danh mục đầu tiên. Ví dụ: &ldquo;Ghi chú chung&rdquo;, &ldquo;Ngữ pháp&rdquo;, &ldquo;Idioms cần nhớ&rdquo;...
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 pb-4 overflow-x-auto items-start select-none">
            {columns.map((column) => (
              <div
                key={column.id}
                className="w-72 bg-slate-800/80 rounded-xl p-3 flex flex-col max-h-[calc(100vh-180px)] shrink-0 border border-slate-700/40 shadow-lg shadow-black/10"
              >
                <ColumnHeader
                  column={column}
                  notesCount={column.notes.length}
                  onRename={handleRenameColumn}
                  onDelete={handleDeleteColumn}
                />

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-2 mb-2 min-h-[80px] rounded-lg p-1 transition-colors duration-200 ${
                        snapshot.isDraggingOver
                          ? "bg-blue-500/5 border-2 border-dashed border-blue-500/20"
                          : column.notes.length === 0
                          ? "border-2 border-dashed border-slate-700/40"
                          : ""
                      }`}
                      style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}
                    >
                      {column.notes.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-full min-h-[60px]">
                          <p className="text-[11px] text-slate-600 text-center px-3">
                            Kéo thả hoặc thêm ghi chú mới
                          </p>
                        </div>
                      )}

                      {column.notes.map((note, noteIndex) => (
                        <Draggable key={note.id} draggableId={note.id} index={noteIndex}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              onClick={() => handleOpenEdit(note)}
                              className={`bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg border border-slate-600/30 cursor-pointer group transition-all duration-150 ${
                                dragSnapshot.isDragging
                                  ? "shadow-2xl shadow-blue-500/10 rotate-[2deg] scale-[1.03] border-blue-500/30 !cursor-grabbing"
                                  : "hover:border-slate-500/40"
                              }`}
                            >
                              <h4 className="font-medium text-slate-100 group-hover:text-blue-400 transition-colors text-sm line-clamp-1">
                                {note.title}
                              </h4>
                              {note.content && (
                                <p className="text-[12px] text-slate-400 mt-1.5 line-clamp-3 whitespace-pre-wrap leading-relaxed">
                                  {note.content}
                                </p>
                              )}
                              <div className="text-[10px] text-slate-500/80 mt-2">
                                {formatRelativeTime(note.updatedAt)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <QuickAddNote columnId={column.id} onAdd={handleAddNote} />
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Edit Modal */}
      <NoteEditModal
        isOpen={editModal.isOpen}
        noteId={editModal.noteId}
        initialTitle={editModal.title}
        initialContent={editModal.content}
        onClose={() => setEditModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
