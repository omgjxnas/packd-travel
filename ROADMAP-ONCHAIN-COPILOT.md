# PACKD — On-chain Copilot · Roadmap

> Plán implementace on-chain Copilota v rámci storefrontu PACKD.
> Stav codebase k 2026-07-14: klientský React (CDN, **bez build stepu**), hash routing
> (`#profile`), cart ve state, hotový **loyalty systém** (tiers, body, rewards, orders, historie).
> Značka je fiktivní prototyp — vše běží jako statická stránka na GitHub Pages.

## 1. Co „on-chain Copilot" znamená pro PACKD

Copilot = konverzační nákupní asistent ve storefrontu, který **umí číst i zapisovat on-chain**.
Napojujeme ho na už existující loyalty vrstvu, ne na zelené louce:

| Dnešní (off-chain) prvek | On-chain protějšek |
| --- | --- |
| `points = 890` (hardcoded) | ERC-20 „PACKD Points" (nepřenositelné / soulbound varianta) |
| `PROFILE_TIERS` (Explorer/Packer/Globetrotter) | Tier = odvozen z on-chain zůstatku bodů, případně tier NFT (ERC-1155) |
| `PROFILE_REWARDS` + `redeem()` | Redeem = on-chain burn bodů → mint reward NFT / voucher kódu |
| `PROFILE_ORDERS` / `PROFILE_HISTORY` | On-chain receipt (event/NFT) jako důkaz nákupu |
| — | **Copilot chat** jako nová vrstva nad tím vším |

Cílový uživatelský flow: připoj peněženku → Copilot vidí tvůj on-chain profil (body, tier,
odměny) → poradí s nákupem → provede on-chain akci (redeem, mint receipt, zkontroluje
token-gated perk) s tvým podpisem.

## 2. Zásadní rozhodnutí (blokují start — potřebuji odsouhlasit)

1. **Build step: ano/ne.** Dnešní projekt je čistě CDN/Babel bez bundleru. Reálné web3
   knihovny (viem/ethers, wallet SDK) se přes `<script>` tahají špatně.
   - *Doporučení:* zavést lehký build (Vite) jen pro web3/Copilot bundle, storefront nechat
     jak je → nový `app.js` importuje jeden `copilot.bundle.js`. Menší riziko než přepis celého UI.
2. **Chain / síť.** Doporučuji **testnet L2** (Base Sepolia nebo Optimism Sepolia) — levné,
   rychlé, pro prototyp fiktivní značky ideální. Žádné reálné peníze.
3. **Custody peněženky.** Non-custodial (injected wallet / WalletConnect) vs. embedded
   (email-login peněženka, např. Privy/Web3Auth). *Doporučení pro low-friction prototyp:*
   embedded wallet, ať uživatel nemusí mít MetaMask.
4. **Copilot „mozek".** Kam volá LLM? Statická GitHub Pages nemá backend → potřeba serverless
   proxy (klíč nesmí do klientu). *Doporučení:* tenká serverless funkce (Cloudflare Worker /
   Vercel) jako proxy k Claude API + on-chain read cache.
5. **Rozsah on-chain zápisů.** Jen loyalty (body/rewards), nebo i platby? *Doporučení:* fáze 1–4
   pouze loyalty; platby mimo scope prototypu.

## 3. Fázovaný plán

### Fáze 0 — Foundations & rozhodnutí  *(předpoklad pro vše ostatní)*
- [ ] Odsouhlasit rozhodnutí z kap. 2 (build, chain, custody, LLM proxy, rozsah)
- [ ] Zavést lehký build pipeline vedle stávající statiky (Vite), CI deploy na GH Pages
- [ ] Nastavit testnet prostředí, faucet, `.env` konvence pro adresy kontraktů
- [ ] ADR dokument s finálními rozhodnutími

### Fáze 1 — Wallet connect vrstva
- [ ] `WalletProvider` (context) + „Připoj peněženku" tlačítko v headeru a profilu
- [ ] Stav připojení, síť-guard (upozornění na špatnou síť), disconnect
- [ ] Fallback UI, když peněženka není → storefront funguje dál i bez připojení
- [ ] Napojit `#profile` na adresu: zobrazit zkrácenou adresu místo/vedle jména

### Fáze 2 — On-chain loyalty (tokenizace stávajícího systému)
- [ ] Smart kontrakty: `PackdPoints` (ERC-20 soulbound) + `PackdRewards` (ERC-1155)
- [ ] Testy kontraktů (Foundry/Hardhat), deploy skript na testnet
- [ ] Nahradit hardcoded `points = 890` čtením on-chain zůstatku
- [ ] Odvodit `PROFILE_TIERS` z on-chain bodů (zachovat stávající vizuál progress baru)
- [ ] `redeem()` → on-chain transakce (burn bodů → mint reward), s optimistickým UI + toastem
- [ ] Zobrazit `PROFILE_HISTORY` z on-chain eventů (číst logy)

### Fáze 3 — Copilot chat (asistenční vrstva)
- [ ] Serverless proxy ke Claude API (klíč na serveru, rate-limit, streaming)
- [ ] Copilot UI: plovoucí panel / drawer, konzistentní se stávajícím designem `styles.css`
- [ ] Kontext pro model: katalog produktů, tier/body uživatele, obsah košíku
- [ ] Read-only schopnosti: „kolik mám bodů", „co si můžu odemknout", „doporuč set na víkend"
- [ ] Prázdné/erroring stavy, reduced-motion respekt (projekt to už řeší)

### Fáze 4 — Copilot ↔ on-chain akce (tool use)
- [ ] Definovat „tools" pro Copilota: `getBalance`, `listRewards`, `redeemReward`,
      `mintReceipt`, `checkTokenGate`
- [ ] Human-in-the-loop: každou zapisující akci potvrzuje uživatel podpisem, ne model sám
- [ ] „Redeem přes chat": Copilot navrhne → uživatel klikne → wallet podepíše → toast
- [ ] Token-gated perky: Copilot pozná držení tier NFT a odemkne skryté odměny/obsah
- [ ] Receipt NFT: po (mock) nákupu nabídne mint on-chain účtenky

### Fáze 5 — Hardening, bezpečnost, deploy
- [ ] Bezpečnost: nikdy neposílat privátní klíče/seed; model nikdy nepodepisuje; validace vstupů
- [ ] Prompt-injection guard (produktová data i chat jsou nedůvěryhodný vstup)
- [ ] Kontrakty: reentrancy/přístupová práva, případně audit checklist
- [ ] E2E test hlavních flow (connect → redeem → chat akce)
- [ ] Dokumentace do README + deploy na GH Pages (statika) + serverless proxy

## 4. Rizika a poznámky
- **No-build constraint je hlavní tření** — buď zavést build (doporučeno), nebo se omezit na
  ESM CDN web3 knihovny (křehčí).
- **GitHub Pages = statika bez backendu** → LLM klíč a jakýkoli secret musí do serverless proxy.
- **Fiktivní značka** → zůstat na testnetu, žádné reálné platby ani sběr reálných dat peněženek.
- **Zpětná kompatibilita** — storefront musí fungovat i bez peněženky/Copilota (progressive enhancement).

## 5. Navrhované pořadí prací
Fáze 0 → 1 → 2 (loyalty on-chain je jádro hodnoty) → 3 (chat) → 4 (spojení) → 5 (hardening).
Fáze 3 lze rozjet paralelně s 2, pokud jsou dvě ruce na klávesnici.
