import { useState } from 'react';
import { Button } from '../shared/Button';
import { TextInput } from '../shared/TextInput';

export function Step1Profile({ onNext }) {
  const [form, setForm] = useState({ name: '', age: '', notes: '', favorites: '' });
  const valid = form.name.trim().length > 0;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full">
      <div className="text-center pt-4">
        <div className="text-5xl mb-3">🐾</div>
        <h1 className="font-serif text-2xl text-warm-dark mb-1">Cuéntame sobre tu mascota</h1>
        <p className="text-sm text-warm-light">Esta información personalizará tu experiencia</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <TextInput
          label="Nombre de tu mascota *"
          value={form.name}
          onChange={set('name')}
          placeholder="Ej: Luna, Max, Canela..."
        />
        <TextInput
          label="Edad aproximada"
          value={form.age}
          onChange={set('age')}
          placeholder="Ej: 12 años"
        />
        <TextInput
          label="Cosas favoritas"
          value={form.favorites}
          onChange={set('favorites')}
          placeholder="Ej: la silla del sol, las caricias en el lomo..."
          multiline
          rows={2}
        />
        <TextInput
          label="Notas importantes"
          value={form.notes}
          onChange={set('notes')}
          placeholder="Condiciones de salud, medicación, necesidades especiales..."
          multiline
          rows={2}
        />
      </div>

      <Button onClick={() => onNext(form)} disabled={!valid}>
        Continuar
      </Button>
    </div>
  );
}
