# Winter 2026 Anime Discovery (2026 冬季新番探索)

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

[English](#english) | [中文說明](#chinese)

---

<a name="english"></a>
## 🇬🇧 English

### Introduction
**Winter 2026 Anime Discovery** is a modern, responsive web application designed to help anime enthusiasts explore upcoming titles for the Winter 2026 season. Built with performance and user experience in mind, it utilizes the Jikan API (Unofficial MyAnimeList API) to provide real-time data, dynamic filtering, and a seamless "Netflix-style" browsing experience.

### Key Features
*   ** Real-time Data:** Fetches the latest anime schedule directly from Jikan API v4.
*   ** Dynamic Filtering:** Automatically generates filter categories based on the fetched data (Source, Genre) with item counts.
*   ** Favorites System:** "Like" your favorite anime to save them to a local watchlist (persisted via LocalStorage).
*   ** Sorting Options:** Sort anime by Score, Popularity (Members), or Default relevance.
*   ** Responsive Design:** Fully adaptive layout that works perfectly on mobile (1 column) to desktop (5 columns).
*   ** Immersive Details:** Click any card to open a modal with high-res cover art, synopsis, statistics, and embedded YouTube trailers.
*   ** Bilingual Support:** Instant toggle between English and Traditional Chinese interfaces.

### Tech Stack
*   **Framework:** React 18 (Client Side Rendering)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Dark Mode / Cyberpunk Aesthetic)
*   **Icons:** Lucide React
*   **API:** Jikan API v4
*   **Build Tool:** Vite (Recommended for deployment)

### Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/winter-2026-anime.git
    cd winter-2026-anime
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:5173` to view the app.

### Deployment (Vercel)
This project is optimized for deployment on [Vercel](https://vercel.com).
1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Vercel will detect the Vite/React settings automatically.
4.  Click **Deploy**.

---

<a name="chinese"></a>
## 🇹🇼 中文說明

### 專案簡介
**2026 冬季新番探索** 是一個現代化、響應式的網頁應用程式，專為動畫愛好者設計。它利用 Jikan API (非官方 MyAnimeList API) 提供 2026 年冬季的最新動畫資訊。專案採用「Cyberpunk」深色風格，提供類似 Netflix 的流暢瀏覽體驗。

### 核心功能
*   ** 即時數據**：直接從 Jikan API v4 獲取最新的動畫列表。
*   ** 動態篩選系統**：根據回傳的資料自動生成篩選類別（按來源、按類型），並顯示各類別的數量。
*   ** 收藏功能**：點擊愛心即可將動畫加入「我的收藏」，資料儲存在瀏覽器 LocalStorage 中，關閉視窗後依然保留。
*   ** 排序功能**：支援按「評分」、「人氣（成員數）」或「預設」順序排列動畫。
*   ** 響應式設計**：完美支援從手機（單欄）到大螢幕桌機（五欄）的各種裝置。
*   ** 沉浸式詳情頁**：點擊卡片開啟詳細視窗，包含高畫質封面、劇情簡介、評分統計及 YouTube 預告片播放。
*   ** 雙語支援**：支援英文與繁體中文介面一鍵切換。

### 技術堆疊
*   **框架**: React 18 (CSR)
*   **語言**: TypeScript
*   **樣式**: Tailwind CSS (深色模式 / 賽博龐克風格)
*   **圖標**: Lucide React
*   **資料來源**: Jikan API v4
*   **建置工具**: Vite (建議使用此工具進行部署)

### 安裝與執行

1.  **複製專案**
    ```bash
    git clone https://github.com/yourusername/winter-2026-anime.git
    cd winter-2026-anime
    ```

2.  **安裝套件**
    ```bash
    npm install
    # 或
    yarn install
    ```

3.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

4.  **開啟瀏覽器**
    前往 `http://localhost:5173` 查看應用程式。

### 部署指南 (Vercel)
本專案非常適合部署於 [Vercel](https://vercel.com)。
1.  將程式碼上傳至 GitHub。
2.  在 Vercel 後台匯入該 Repository。
3.  Vercel 會自動偵測 Vite/React 設定。
4.  點擊 **Deploy** 即可上線，這通常也能解決 YouTube 播放器的跨域問題 (Error 153)。

---

### Disclaimer
This project uses the Jikan API, which is an open-source API for MyAnimeList. It is not affiliated with MyAnimeList.net.
本專案使用 Jikan API，這是 MyAnimeList 的開源 API。本專案與 MyAnimeList.net 無附屬關係。
