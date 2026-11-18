export default function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // elimina caracteres especiales
    .replace(/\s+/g, '-') // espacios → guiones
    .replace(/-+/g, '-') // evita guiones dobles
}
