import { useState, useEffect } from 'react'
import { StickyNote, Plus, X, Save } from 'lucide-react'

interface Note {
  id: string
  text: string
  timestamp: number
}

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('campaign_notes')
    if (saved) {
      try {
        setNotes(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading notes:', e)
      }
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('campaign_notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!newNote.trim()) return
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      timestamp: Date.now(),
    }
    
    setNotes(prev => [note, ...prev])
    setNewNote('')
    setIsAdding(false)
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
      <div className="relative bg-slate-900/95 backdrop-blur-sm border-2 border-amber-900/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-amber-950/50 to-orange-950/30 border-b border-amber-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full" />
                <StickyNote className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white"><span className="hidden sm:inline">Notas Rápidas</span><span className="sm:hidden">Notas</span></h3>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="p-1.5 sm:p-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/30 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
          {/* Add Note Form */}
          {isAdding && (
            <div className="relative group/form animate-in slide-in-from-top-2 duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-20" />
              <div className="relative p-2.5 sm:p-3 bg-slate-800/80 backdrop-blur-sm border-2 border-green-900/50 rounded-xl">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full p-2.5 sm:p-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={addNote}
                    className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Guardar</span>
                    <span className="sm:hidden">OK</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false)
                      setNewNote('')
                    }}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-lg transition-all"
                  >
                    <span className="hidden sm:inline">Cancelar</span>
                    <span className="sm:hidden">X</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 mx-auto mb-3 text-amber-400/30" />
                <p className="text-sm text-gray-500">No hay notas aún</p>
                <p className="text-xs text-gray-600 mt-1">Haz clic en + para agregar una</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="relative group/note"
                >
                  <div className="absolute -inset-0.5 bg-amber-600 rounded-xl blur opacity-0 group-hover/note:opacity-10 transition" />
                  <div className="relative p-2.5 sm:p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="flex-1 text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                        {note.text}
                      </p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 hover:bg-red-600/20 rounded transition-all opacity-100 sm:opacity-0 group-hover/note:opacity-100"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 sm:mt-2 font-mono">
                      {new Date(note.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notes.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('¿Borrar todas las notas?')) {
                  setNotes([])
                }
              }}
              className="w-full py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Borrar todas las notas
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
