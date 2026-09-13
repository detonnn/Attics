export const headerTemplate = `
<header class="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant">
  <div class="h-14 w-full px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
    <div class="flex items-center gap-space-md">
      <a class="flex items-center gap-space-sm text-primary group" data-path="home" href="#"><span class="font-headline-sm text-headline-sm uppercase tracking-tighter text-primary">attics.std</span></a>
      <span class="hidden sm:inline-block font-label-sm text-label-sm text-outline uppercase">[ARCHIVE 1-OF-1]</span>
    </div>
    <nav class="hidden md:flex items-center gap-space-lg" data-active-classes="text-primary border-b border-primary">
      <a class="font-label-md uppercase tracking-wider transition-colors py-1 text-primary border-b border-primary" data-path="home" href="#">HOME</a>
      <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="catalog" href="#">CATALOG</a>
      <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="contact" href="#">CONTACT</a>
    </nav>
    <div class="flex items-center gap-space-md">
      <a class="hidden sm:inline-block font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">DM @ATTICS.STD</a>
      <a class="flex items-center gap-space-xs font-label-md text-label-md border border-outline-variant px-space-sm py-1 text-primary hover:border-primary transition-colors" data-path="cart" href="#"><span class="material-symbols-outlined text-body-md">shopping_bag</span><span id="header-bag-text">BAG [01]</span></a>
      <button id="mobile-menu-btn" class="md:hidden w-8 h-8 flex items-center justify-center border border-outline-variant text-primary hover:border-primary active:scale-95 transition-all" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav"><span class="material-symbols-outlined text-[20px]">menu</span></button>
      <div class="relative pl-space-sm border-l border-outline-variant">
        <button id="profile-menu-btn" class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hover:border-primary focus:outline-none focus:border-primary active:scale-95 transition-all" aria-label="Profile settings" aria-expanded="false">
          <img id="profile-avatar" alt="Profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UnsKpJLr7iWfDLbFs1Wgi1OXaogyxAJPdSInayfGoKjl6Q6OzxGXbWEy4IVR-YfdhECJ6MpqhNlFQTrCObdzrNnaWLFJ8MqlbQWA_ijW72zBBqQ1jHWOFUtVER1EJuHeiqtDeHRFOjAmFMg15mGANQhunycsz1pJL-gUknlh8LcgNC7SZYe0mbxwpFu1VwulVNnP948WGGNzC_O1_8UqnPBn2hFzvQ_wNEMouyNvu4ic5mTfaRl9HSZG6Rb1JUaY-FB5oPfzxDGIk"/>
        </button>
        <span id="profile-name-badge" class="hidden absolute -bottom-1 -right-1 bg-primary text-surface-container-lowest font-label-sm text-[9px] px-1 py-0.5 leading-none border border-surface-container-lowest max-w-[80px] truncate"></span>
        <div id="profile-dropdown" class="hidden absolute right-0 top-10 w-[340px] bg-surface-container border border-outline-variant shadow-2xl z-50 overflow-hidden">
          <div class="p-space-md flex flex-col gap-space-md">
            <div class="flex items-center justify-between"><span class="font-label-md text-label-md text-primary uppercase font-bold">PROFILE SETTINGS</span><button id="profile-close-btn" class="w-6 h-6 flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container-highest border border-transparent hover:border-outline-variant" type="button"><span class="material-symbols-outlined text-[16px]">close</span></button></div>
            <div class="flex gap-space-md items-start">
              <div class="relative shrink-0"><img id="profile-preview" alt="Preview" class="w-16 h-16 rounded-full object-cover border-2 border-outline-variant bg-surface-container-lowest"/><label class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-surface-container-lowest rounded-full flex items-center justify-center cursor-pointer hover:bg-surface-container-highest hover:text-primary border border-primary"><span class="material-symbols-outlined text-[14px]">photo_camera</span><input id="profile-file-input" type="file" accept="image/*" class="hidden"></label></div>
              <div class="flex flex-col gap-1 flex-1 min-w-0"><span class="font-label-sm text-label-sm text-outline uppercase">DISPLAY NAME</span><span id="profile-preview-name" class="font-headline-sm text-headline-sm text-primary truncate">ARCHIVE COLLECTOR</span><span id="profile-preview-handle" class="font-label-sm text-label-sm text-outline truncate">@attics.collector</span></div>
            </div>
            <div class="flex flex-col gap-space-sm">
              <label class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-outline uppercase">DISPLAY NAME</span><input id="profile-name-input" class="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none focus:border-primary" placeholder="ARCHIVE COLLECTOR" type="text"></label>
              <label class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-outline uppercase">HANDLE / @USERNAME</span><input id="profile-handle-input" class="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none focus:border-primary" placeholder="@attics.collector" type="text"></label>
              <label class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-outline uppercase">AVATAR URL</span><input id="profile-url-input" class="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary" placeholder="https://..." type="url"></label>
              <label class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-outline uppercase">BIO / STATUS</span><input id="profile-bio-input" class="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary" placeholder="1-of-1 collector - Jakarta" type="text"></label>
            </div>
            <div class="flex gap-space-xs"><button id="profile-save-btn" class="flex-1 py-2.5 bg-primary text-surface-container-lowest font-label-md text-label-md uppercase font-bold hover:bg-surface-container-highest hover:text-primary border border-primary btn-spring" type="button">SAVE CHANGES</button><button id="profile-reset-btn" class="px-4 py-2.5 bg-surface-container-lowest text-outline font-label-sm text-label-sm uppercase border border-outline-variant hover:text-primary hover:border-primary btn-spring" type="button">RESET</button></div>
            <span id="profile-saved-msg" class="hidden font-label-sm text-label-sm text-emerald-400 uppercase text-center">✓ PROFILE UPDATED</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden md:hidden w-full bg-surface-container-lowest border-t border-outline-variant flex-col">
    <a class="font-label-md uppercase tracking-wider py-3 px-margin border-b border-outline-variant/40 text-primary" data-path="home" href="#">HOME</a>
    <a class="font-label-md uppercase tracking-wider py-3 px-margin border-b border-outline-variant/40 text-on-surface-variant" data-path="catalog" href="#">CATALOG</a>
    <a class="font-label-md uppercase tracking-wider py-3 px-margin border-b border-outline-variant/40 text-on-surface-variant" data-path="contact" href="#">CONTACT</a>
    <a class="font-label-md uppercase tracking-wider py-3 px-margin text-on-surface-variant sm:hidden" data-path="contact" href="#">DM @ATTICS.STD</a>
  </nav>
</header>
`;

export const footerTemplate = `
<footer class="w-full bg-surface-container-lowest border-t border-outline-variant">
  <div class="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-space-lg pb-space-lg border-b border-outline-variant">
      <div class="md:col-span-4 flex flex-col gap-space-xs"><span class="font-headline-sm text-headline-sm text-primary uppercase">attics.std</span><span class="font-label-sm text-label-sm text-outline uppercase tracking-widest">STREETWEAR ARCHIVE — EDITION 2024</span><span class="font-label-sm text-label-sm text-outline hidden lg:block" id="footer-cursor-coords">CURSOR TELEMETRY: [X: 0651 // Y: 0065]</span></div>
      <div class="md:col-span-8 flex flex-wrap items-center justify-start md:justify-end gap-x-space-lg gap-y-space-xs">
        <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="home" href="#">HOME</a>
        <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="catalog" href="#">CATALOG</a>
        <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="contact" href="#">CONTACT</a>
        <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="cart" href="#">CART</a>
      </div>
    </div>
    <div class="pt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm"><p class="font-label-sm text-label-sm text-outline uppercase tracking-wider">© 2024 ATTICS.STD STUDIO. ALL RIGHTS RESERVED.</p><p class="font-label-sm text-label-sm text-outline uppercase tracking-wider">TOKYO / LONDON / NEW YORK</p></div>
  </div>
</footer>
`;
