import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMotorcycles } from "@/hooks/useMotorcycles";

export function MotorcyclesScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const {
    motorcycles,
    loading,
    error,
    addMotorcycle,
    deleteMotorcycle,
  } = useMotorcycles(user?.uid);

  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMoto, setNewMoto] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    emoji: "🏍️",
  });

  const handleAdd = async () => {
    if (newMoto.name && newMoto.brand && newMoto.model && newMoto.year) {
      try {
        setSaving(true);
        await addMotorcycle(newMoto);
        setNewMoto({ name: "", brand: "", model: "", year: "", color: "", emoji: "🏍️" });
        setIsAdding(false);
      } catch (err) {
        // Error handled by hook
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (motorcycles.length === 1) {
      alert("No puedes eliminar tu última moto");
      return;
    }
    if (confirm("¿Estás seguro de eliminar esta moto?")) {
      await deleteMotorcycle(id);
    }
  };

  const emojiOptions = ["🏍️", "🛵", "🏁", "⚡", "🔥", "💨", "🚀", "⭐"];

  return (
    <div className="h-full bg-[#0F0F0F] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A]">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-[Space_Grotesk] flex-1" style={{ fontWeight: 700 }}>
          Mis Motos
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-[#FF6B2B] rounded-full flex items-center justify-center hover:bg-[#FF8C5A] transition-colors"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Error message */}
        {error && (
          <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-2xl px-4 py-3">
            <p className="text-sm text-[#E74C3C]">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#FF6B2B] animate-spin" />
          </div>
        )}

        {/* Add new motorcycle form */}
        {isAdding && (
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#FF6B2B]">
            <h3 className="font-[Space_Grotesk] mb-4" style={{ fontWeight: 600 }}>
              Agregar nueva moto
            </h3>

            {/* Emoji selector */}
            <div className="mb-4">
              <label className="text-sm text-[#888888] mb-2 block">Icono</label>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewMoto({ ...newMoto, emoji })}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      newMoto.emoji === emoji
                        ? "bg-[#FF6B2B] scale-110"
                        : "bg-[#2A2A2A] hover:bg-[#3A3A3A]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre (ej: Mi Ninja)"
                value={newMoto.name}
                onChange={(e) => setNewMoto({ ...newMoto, name: e.target.value })}
                className="w-full bg-[#2A2A2A] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#FF6B2B] transition-colors"
              />
              <input
                type="text"
                placeholder="Marca (ej: Kawasaki)"
                value={newMoto.brand}
                onChange={(e) => setNewMoto({ ...newMoto, brand: e.target.value })}
                className="w-full bg-[#2A2A2A] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#FF6B2B] transition-colors"
              />
              <input
                type="text"
                placeholder="Modelo (ej: Ninja 400)"
                value={newMoto.model}
                onChange={(e) => setNewMoto({ ...newMoto, model: e.target.value })}
                className="w-full bg-[#2A2A2A] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#FF6B2B] transition-colors"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Año"
                  value={newMoto.year}
                  onChange={(e) => setNewMoto({ ...newMoto, year: e.target.value })}
                  className="flex-1 bg-[#2A2A2A] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#FF6B2B] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={newMoto.color}
                  onChange={(e) => setNewMoto({ ...newMoto, color: e.target.value })}
                  className="flex-1 bg-[#2A2A2A] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#FF6B2B] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsAdding(false)}
                disabled={saving}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 py-3 rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Agregar"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Motorcycles list */}
        {!loading && (
          <div className="space-y-3">
            {motorcycles.map((moto) => (
              <div
                key={moto.id}
                className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#888888]/10 hover:border-[#888888]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center text-3xl">
                    {moto.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                      {moto.name}
                    </h3>
                    <p className="text-sm text-[#888888] mb-2">
                      {moto.brand} {moto.model} · {moto.year}
                    </p>
                    {moto.color && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A2A2A] rounded-full text-xs">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-700" />
                        {moto.color}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(moto.id)}
                      className="w-10 h-10 bg-[#E74C3C]/10 hover:bg-[#E74C3C]/20 border border-[#E74C3C] rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#E74C3C]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && motorcycles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              🏍️
            </div>
            <p className="text-[#888888] mb-4">No tienes motos registradas</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-[#FF6B2B] hover:bg-[#FF8C5A] rounded-xl transition-colors"
            >
              Agregar mi primera moto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
