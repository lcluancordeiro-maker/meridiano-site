import Navbar from "@/components/Navbar";

export default function PrivacidadePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-muted">Última atualização: 13 de julho de 2026.</p>

        <p className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
          Este documento foi gerado como ponto de partida, com base na Lei
          Geral de Proteção de Dados (LGPD — Lei 13.709/2018), e ainda
          precisa dos dados reais de contato do responsável pelo app
          preenchidos abaixo. Não substitui uma revisão por um advogado
          antes de publicar em produção.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              1. Quem somos
            </h2>
            <p className="mt-2">
              O Meridiano Matemática (“nós”) é o controlador dos dados
              pessoais tratados através deste app, conforme a LGPD. Dúvidas
              sobre esta política ou sobre seus dados podem ser enviadas
              para <strong>[e-mail de contato a definir]</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              2. Quais dados coletamos
            </h2>
            <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
              <li>
                <strong>Conta:</strong> e-mail e nome (se informado no
                cadastro). Senhas são gerenciadas inteiramente pelo Supabase
                Auth — nunca ficam em texto puro em nosso banco de dados.
              </li>
              <li>
                <strong>Progresso e gamificação:</strong> respostas dadas,
                pontuação, XP, sequência de dias ativos e conquistas
                desbloqueadas, para sincronizar seu progresso entre
                dispositivos.
              </li>
              <li>
                <strong>Assinatura:</strong> status da assinatura Premium e
                um identificador de cliente da Stripe. Dados de cartão,
                boleto ou Pix são processados inteiramente pela Stripe —
                nunca tocam nossos servidores.
              </li>
              <li>
                <strong>Fotos e desenhos enviados para “resolver por
                foto”/“quadro”:</strong> enviados à API da Anthropic (Claude)
                apenas para gerar a solução passo a passo. Não guardamos
                cópia dessas imagens em nosso banco de dados depois de
                responder à sua solicitação; a retenção desses dados pelo
                lado da Anthropic segue a política de privacidade própria
                deles.
              </li>
              <li>
                <strong>Preferências de idioma e tema:</strong> guardadas em
                cookie/armazenamento local do navegador, sem identificar
                você pessoalmente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              3. Base legal e finalidade
            </h2>
            <p className="mt-2">
              Tratamos seus dados para executar o contrato de uso do app
              (art. 7º, V da LGPD) — criar sua conta, sincronizar progresso,
              processar sua assinatura — e, quando aplicável, com base no
              seu consentimento (por exemplo, ao enviar uma foto para a
              funcionalidade de IA).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              4. Com quem compartilhamos
            </h2>
            <p className="mt-2">
              Usamos os seguintes operadores de dados, cada um responsável
              por sua própria parte do processamento:
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-2 pl-5">
              <li>
                <strong>Supabase</strong> — banco de dados e autenticação.
              </li>
              <li>
                <strong>Stripe</strong> — processamento de pagamentos e
                assinaturas.
              </li>
              <li>
                <strong>Anthropic (Claude API)</strong> — geração das
                soluções de matemática a partir de fotos/desenhos.
              </li>
            </ul>
            <p className="mt-2">
              Não vendemos seus dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              5. Retenção e exclusão
            </h2>
            <p className="mt-2">
              Mantemos seus dados enquanto sua conta estiver ativa. Para
              solicitar a exclusão da sua conta e dos dados associados,
              entre em contato pelo e-mail acima — ainda não temos um botão
              de autoatendimento para isso dentro do app (é um item no
              roadmap).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              6. Seus direitos (art. 18 da LGPD)
            </h2>
            <p className="mt-2">
              Você pode solicitar, a qualquer momento: confirmação do
              tratamento, acesso aos dados, correção de dados incompletos
              ou desatualizados, anonimização/eliminação de dados
              desnecessários, portabilidade, eliminação dos dados tratados
              com seu consentimento, informação sobre compartilhamento, e
              revogação do consentimento. Envie sua solicitação para o
              e-mail de contato acima.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              7. Segurança
            </h2>
            <p className="mt-2">
              Toda comunicação com o app é feita por HTTPS. O banco de dados
              usa Row Level Security (RLS) — cada usuário só consegue
              acessar, por meio da aplicação, os próprios dados. Chaves com
              privilégio elevado (como a chave de serviço do Supabase e as
              chaves secretas da Stripe/Anthropic) ficam apenas no servidor,
              nunca expostas ao navegador.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              8. Cookies
            </h2>
            <p className="mt-2">
              Usamos um cookie para lembrar seu idioma preferido e cookies
              de sessão do Supabase Auth para manter você logado. Não
              usamos cookies de rastreamento publicitário.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
