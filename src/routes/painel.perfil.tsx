import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/painel/perfil")({
  head: () => ({ meta: [
    { title: "Perfil — FluxoPro" },
    { name: "description", content: "Sua foto, identificação e acesso à conta FluxoPro." },
    { property: "og:title", content: "Perfil — FluxoPro" },
    { property: "og:description", content: "Sua foto, identificação e acesso à conta FluxoPro." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Perfil,
});

function formatDoc(d: string) {
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return d;
}

function Perfil() {
  const { user, sair, atualizarMetadados } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const meta = (user?.user_metadata ?? {}) as { nome?: string; documento?: string; empresa?: string; avatar_path?: string };

  useEffect(() => {
    if (!meta.avatar_path) return undefined;
    void supabase.storage.from("avatars").createSignedUrl(meta.avatar_path, 60 * 60 * 24 * 7).then(({ data }) => setFoto(data?.signedUrl ?? null));
    return undefined;
  }, [meta.avatar_path]);

  async function escolher(e: React.ChangeEvent<HTMLInputElement>): Promise<unknown> {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return undefined;
    if (!file.type.startsWith("image/")) return toast.error("Escolha uma imagem");
    setEnviando(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setEnviando(false); return toast.error("Não foi possível enviar a foto"); }
    if (meta.avatar_path) await supabase.storage.from("avatars").remove([meta.avatar_path]);
    const falha = await atualizarMetadados({ avatar_path: path });
    setEnviando(false);
    if (falha) return toast.error("Não foi possível salvar a foto");
    return toast.success("Foto atualizada!");
  }

  async function desconectar() {
    await qc.cancelQueries();
    qc.clear();
    await sair();
    navigate({ to: "/login", replace: true });
  }

  return <div className="mx-auto max-w-md text-center">
    <h1 className="text-left font-display text-2xl font-bold text-foreground">Perfil</h1>
    <section className="mt-6 rounded-3xl border border-border bg-card/70 p-8 shadow-card backdrop-blur-xl">
      <button type="button" onClick={() => input.current?.click()} disabled={enviando} aria-label="Alterar foto de perfil" className="group relative mx-auto block size-32 rounded-full border-4 border-primary/40 bg-muted shadow-lift">
        {foto ? <img src={foto} alt="Foto de perfil" className="size-full rounded-full object-cover" /> : <UserRound size={56} className="mx-auto text-muted-foreground" />}
        <span className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-card">
          <Camera size={17} className={enviando ? "animate-pulse" : ""} />
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={escolher} />
      <p className="mt-6 text-xs font-semibold uppercase text-muted-foreground">Usuário (CPF/CNPJ)</p>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">{meta.documento ? formatDoc(meta.documento) : "—"}</p>
      {meta.nome && <p className="mt-3 text-sm text-foreground/80">{meta.nome}</p>}
      {meta.empresa && <p className="text-sm text-muted-foreground">{meta.empresa}</p>}
      <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
    </section>
    <button type="button" onClick={desconectar} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-danger/40 bg-danger-soft font-semibold text-danger transition-colors hover:bg-danger/20">
      <LogOut size={17} />Sair / Desconectar
    </button>
  </div>;
}
