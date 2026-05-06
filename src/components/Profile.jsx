import { useState } from 'react';
import { Button } from './shared/Button';
import { TextInput } from './shared/TextInput';

const PET_AVATARS = ['🐾', '🐕', '🐈', '🐇', '🐦', '🐠', '🐢', '🐹', '🐩', '🦮'];

function AvatarPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-20 h-20 rounded-full bg-terracotta-pale border-4 border-terracotta/30 flex items-center justify-center text-4xl shadow-warm transition-all active:scale-95 hover:border-terracotta"
      >
        {value}
      </button>
      <span className="text-[10px] text-warm-pale">Toca para cambiar</span>
      {open && (
        <div className="grid grid-cols-5 gap-2 p-3 bg-surface rounded-2xl border border-border shadow-warm-lg animate-fade-in">
          {PET_AVATARS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => { onChange(emoji); setOpen(false); }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-all active:scale-95 ${
                value === emoji ? 'bg-terracotta-pale ring-2 ring-terracotta' : 'hover:bg-cream-dark'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onDelete }) {
  const date = new Date(note.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex items-start gap-3 p-3 bg-surface-warm rounded-xl border border-border">
      <div className="flex-1">
        <p className="text-sm text-warm-dark leading-relaxed">{note.text}</p>
        <p className="text-xs text-warm-pale mt-1">{date}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(note.id)}
        className="text-warm-pale hover:text-red-400 transition-colors p-1 -mt-0.5 active:scale-90 shrink-0"
        aria-label="Eliminar nota"
      >
        ✕
      </button>
    </div>
  );
}

// Form to edit a single profile's basic info
function ProfileForm({ profile, onSave, label }) {
  const [form, setForm] = useState({
    name: profile.name || '',
    age: profile.age || '',
    favorites: profile.favorites || '',
    notes: profile.notes || '',
    avatar: profile.avatar || '🐾',
  });
  const [importantNotes, setImportantNotes] = useState(profile.importantNotes || []);
  const [newNote, setNewNote] = useState('');
  const [saved, setSaved] = useState(false);

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  function addNote() {
    if (!newNote.trim()) return;
    setImportantNotes((prev) => [
      { id: Date.now(), text: newNote.trim(), date: new Date().toISOString() },
      ...prev,
    ]);
    setNewNote('');
  }

  function deleteNote(id) {
    setImportantNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleSave() {
    onSave({ ...profile, ...form, importantNotes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-4">
      {label && <p className="text-xs font-semibold text-warm-pale uppercase tracking-wide">{label}</p>}

      <div className="flex justify-center">
        <AvatarPicker value={form.avatar} onChange={set('avatar')} />
      </div>

      <TextInput label="Nombre" value={form.name} onChange={set('name')} placeholder="Nombre de tu mascota" />
      <TextInput label="Edad" value={form.age} onChange={set('age')} placeholder="Ej: 12 años" />
      <TextInput
        label="Cosas favoritas"
        value={form.favorites}
        onChange={set('favorites')}
        placeholder="La silla del sol, las caricias en el lomo..."
        multiline rows={2}
      />
      <TextInput
        label="Salud y cuidados generales"
        value={form.notes}
        onChange={set('notes')}
        placeholder="Condiciones de salud, medicación, necesidades especiales..."
        multiline rows={3}
      />

      <Button onClick={handleSave} disabled={!form.name.trim()}>
        {saved ? '✓ Cambios guardados' : 'Guardar cambios'}
      </Button>

      {/* Important notes */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-base">📌</span>
          <h3 className="font-hand text-lg text-warm-dark">Notas importantes</h3>
        </div>
        <p className="text-xs text-warm-light -mt-1">
          Observaciones del día a día: comportamientos nuevos, visitas al veterinario, cambios de rutina...
        </p>
        <div className="flex flex-col gap-2">
          <TextInput value={newNote} onChange={setNewNote} placeholder="Escribe una nota..." multiline rows={2} />
          <Button onClick={addNote} disabled={!newNote.trim()} variant="secondary">+ Agregar nota</Button>
        </div>
        {importantNotes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {importantNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-warm-pale py-4">Aún no hay notas. ¡Agrega la primera!</p>
        )}
      </div>
    </div>
  );
}

// Mini form to add the second pet
function AddPetForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ name: '', age: '', notes: '', favorites: '', avatar: '🐾' });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="animate-slide-up flex flex-col gap-4 p-4 bg-sage-pale rounded-2xl border-2 border-sage">
      <div className="flex items-center gap-2">
        <span className="text-xl">🐾</span>
        <h3 className="font-hand text-lg text-warm-dark">Segunda mascota</h3>
      </div>

      <div className="flex justify-center">
        <AvatarPicker value={form.avatar} onChange={set('avatar')} />
      </div>

      <TextInput label="Nombre *" value={form.name} onChange={set('name')} placeholder="Nombre de tu mascota" />
      <TextInput label="Edad" value={form.age} onChange={set('age')} placeholder="Ej: 8 años" />
      <TextInput
        label="Cosas favoritas"
        value={form.favorites}
        onChange={set('favorites')}
        placeholder="Sus cosas preferidas..."
        multiline rows={2}
      />
      <TextInput
        label="Salud y cuidados"
        value={form.notes}
        onChange={set('notes')}
        placeholder="Condiciones de salud, medicación..."
        multiline rows={2}
      />
      <div className="flex gap-2">
        <Button onClick={() => onAdd(form)} disabled={!form.name.trim()} variant="sage">
          Agregar mascota
        </Button>
        <button
          onClick={onCancel}
          className="flex-1 min-h-[48px] rounded-2xl border border-border text-warm-light text-sm active:scale-95"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Pet selector tabs at the top
function PetTabs({ profiles, activeIndex, onSwitch }) {
  return (
    <div className="flex gap-2">
      {profiles.map((p, i) => (
        <button
          key={p.id}
          onClick={() => onSwitch(i)}
          className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-2xl border-2 transition-all active:scale-95 ${
            i === activeIndex
              ? 'border-terracotta bg-terracotta-pale shadow-warm'
              : 'border-border bg-surface-warm hover:border-terracotta-light'
          }`}
        >
          <span className="text-2xl">{p.avatar || '🐾'}</span>
          <div className="text-left flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${i === activeIndex ? 'text-terracotta-dark' : 'text-warm-mid'}`}>
              {p.name}
            </p>
            {p.age && <p className="text-xs text-warm-pale truncate">{p.age}</p>}
          </div>
          {i === activeIndex && <span className="text-terracotta text-xs shrink-0">✓</span>}
        </button>
      ))}
    </div>
  );
}

export function Profile({ profiles, activeIndex, onSaveProfile, onSwitchProfile, onAddProfile }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const profile = profiles[activeIndex];
  const canAddSecond = profiles.length < 2;

  function handleSave(updated) {
    onSaveProfile(activeIndex, updated);
  }

  function handleAdd(data) {
    onAddProfile(data);
    setShowAddForm(false);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="pt-8">
        <h1 className="font-hand text-3xl text-warm-dark">Mis mascotas</h1>
        <p className="text-sm text-warm-light mt-1">
          {profiles.length === 1 ? 'Puedes agregar hasta 2 mascotas' : '2 mascotas registradas'}
        </p>
      </div>

      {/* Pet tabs — always visible if 2 pets */}
      {profiles.length > 1 && (
        <PetTabs profiles={profiles} activeIndex={activeIndex} onSwitch={onSwitchProfile} />
      )}

      {/* Divider label */}
      {profiles.length > 1 && (
        <p className="text-xs font-semibold text-warm-pale uppercase tracking-wide -mb-2">
          Editando: {profile.avatar} {profile.name}
        </p>
      )}

      {/* Edit form for active profile */}
      <ProfileForm key={profile.id} profile={profile} onSave={handleSave} />

      {/* Add second pet */}
      {canAddSecond && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 min-h-[52px] rounded-2xl border-2 border-dashed border-sage text-sage-dark font-semibold text-sm transition-all active:scale-95 hover:bg-sage-pale"
        >
          <span className="text-xl">+</span> Agregar segunda mascota
        </button>
      )}

      {showAddForm && (
        <AddPetForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
