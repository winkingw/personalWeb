# 本地启动、预览与上线流程

这个文档记录当前项目的本地启动、Cloudflare Pages 预览、推送上线、公开地址和真实域名配置流程。

## 本地开发启动

```powershell
cd D:\programs\personalWeb
pnpm install
pnpm dev --host 127.0.0.1 --port 3000
```

打开：

```text
http://127.0.0.1:3000
```

如果端口变成 `3001`、`3002`，通常是因为 `3000` 已经被另一个 Nuxt/dev server 占用了。先查再杀：

```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

## Nuxt Dev 和 Cloudflare Pages 预览的区别

`3000` 是 Nuxt dev；`8788` 是 Cloudflare Pages 本地预览。端口一直变，多半是因为旧进程没关，或者同时开了 Nuxt dev 和 wrangler preview。停止用 `Ctrl+C`，wrangler 也可以按 `x`。

`Nuxt dev` 是开发服务器：

- 主要用于日常写代码和看页面变化。
- 默认命令是 `pnpm dev`。
- 支持热更新，改 Vue、CSS、配置后页面会快速刷新。
- 更适合开发阶段调试组件、样式、页面逻辑。
- 它不完全等同于最终 Cloudflare Pages 的运行环境。

`Cloudflare Pages 本地预览` 是上线前预览：

- 主要用于检查 `dist/` 静态构建产物。
- 默认命令是 `npx wrangler pages dev dist --ip 127.0.0.1 --port 8788`。
- 需要先运行 `pnpm generate` 生成 `dist/`。
- 更接近 Cloudflare Pages 部署后的效果。
- 适合上线前检查路由、静态资源、headers、redirects、sitemap、robots.txt。

简单记：

```text
写代码时用 3000：pnpm dev
上线前验收用 8788：pnpm generate + wrangler pages dev dist
```

## 上线前本地完整预览

```powershell
cd D:\programs\personalWeb

$env:SITE_URL="https://personal-website.pages.dev"

pnpm typecheck
pnpm test
pnpm generate

npx wrangler pages dev dist --ip 127.0.0.1 --port 8788
```

打开：

```text
http://127.0.0.1:8788
```

## 第一次推送上线流程

```powershell
cd D:\programs\personalWeb

git init
git branch -M main
git add .
git commit -m "Initial deploy-ready personal website"
```

去 GitHub 创建一个空仓库，比如 `personal-website`，然后：

```powershell
git remote add origin https://github.com/<你的GitHub用户名>/personal-website.git
git push -u origin main
```

如果安装了 GitHub CLI，也可以直接：

```powershell
gh repo create personal-website --private --source . --remote origin --push
```

## Cloudflare Pages 项目创建

```powershell
npx wrangler login
npx wrangler whoami
npx wrangler pages project create personal-website --production-branch main
```

手动部署一次也可以：

```powershell
$env:SITE_URL="https://personal-website.pages.dev"
pnpm generate
npx wrangler pages deploy dist --project-name=personal-website --branch=main
```

部署成功后 Cloudflare 会给一个默认公开地址，通常是：

```text
https://personal-website.pages.dev
```

## GitHub Actions 自动部署配置

GitHub 仓库里设置：

Secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Variable:

```text
SITE_URL=https://personal-website.pages.dev
```

如果安装了 `gh`：

```powershell
gh secret set CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_ACCOUNT_ID
gh variable set SITE_URL --body "https://personal-website.pages.dev"
```

之后每次推送到 `main`：

```powershell
git add .
git commit -m "Update site"
git push
```

GitHub Actions 会自动跑：

```text
pnpm install
pnpm typecheck
pnpm test
npx nuxi generate
wrangler pages deploy dist/
```

## 真实域名去哪里搞

最简单路线：

1. 去 Cloudflare Registrar 买域名，或者去 Porkbun / Namecheap / GoDaddy / 阿里云 / 腾讯云买。
2. 如果不是 Cloudflare 买的，把域名 nameserver 改到 Cloudflare。
3. Cloudflare Dashboard 里进入：

```text
Workers & Pages -> personal-website -> Custom domains -> Set up a custom domain
```

4. 添加你的域名，比如：

```text
takagisan.dev
```

5. 成功后，把 GitHub 变量改成真实域名：

```powershell
gh variable set SITE_URL --body "https://takagisan.dev"
```

6. 再推送一次触发重新构建：

```powershell
git commit --allow-empty -m "Redeploy with production domain"
git push
```

## 联系表单环境变量

联系表单还需要 Cloudflare Pages 环境变量：

```powershell
npx wrangler pages secret put CONTACT_TO_EMAIL --project-name=personal-website
npx wrangler pages secret put RESEND_API_KEY --project-name=personal-website
```

`CONTACT_TO_EMAIL` 填你的收件邮箱；`RESEND_API_KEY` 是 Resend 邮件服务的 API Key。
