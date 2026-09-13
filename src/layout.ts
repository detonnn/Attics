export const headerTemplate = `
<header class="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
    <div class="h-14 w-full px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
      <div class="flex items-center gap-space-md">
        <a class="flex items-center gap-space-sm text-primary group" data-path="home" href="#"><span class="font-headline-sm text-headline-sm uppercase tracking-tighter text-primary">attics.std</span></a>
        <span class="hidden sm:inline-block font-label-sm text-label-sm text-outline uppercase">[ARCHIVE]</span>
      </div>
      <nav class="hidden md:flex items-center gap-space-lg" data-active-classes="text-primary border-b border-primary">
        <a class="font-label-md uppercase tracking-wider transition-colors py-1 text-primary border-b border-primary" data-path="home" href="#">HOME</a>
        <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="catalog" href="#">CATALOG</a>
        <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="product" href="#">PRODUCT</a>
        <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="contact" href="#">CONTACT</a>
        <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1" data-path="cart" href="#">CART</a>
      </nav>
      <div class="flex items-center gap-space-md">
        <a class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors hidden sm:inline" data-path="contact" href="#">DM @ATTICS.STD</a>
        <a class="flex items-center gap-space-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors" data-path="cart" href="#" title="Cart"><span class="material-symbols-outlined text-body-lg leading-none">shopping_bag</span><span class="font-label-sm text-label-sm text-primary">[ 1 ]</span></a>
        <div class="pl-space-sm border-l border-outline-variant"><img alt="Profile" class="w-8 h-8 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida/AEtjO1UnsKpJLr7iWfDLbFs1Wgi1OXaogyxAJPdSInayfGoKjl6Q6OzxGXbWEy4IVR-YfdhECJ6MpqhNlFQTrCObdzrNnaWLFJ8MqlbQWA_ijW72zBBqQ1jHWOFUtVER1EJuHeiqtDeHRFOjAmFMg15mGANQhunycsz1pJL-gUknlh8LcgNC7SZYe0mbxwpFu1VwulVNnP948WGGNzC_O1_8UqnPBn2hFzvQ_wNEMouyNvu4ic5mTfaRl9HSZG6Rb1JUaY-FB5oPfzxDGIk" /></div>
      </div>
    </div>
  </header>
`;

export const footerTemplate = `
<footer class="w-full bg-surface-container-lowest border-t border-outline-variant">
    <div class="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-space-lg pb-space-lg border-b border-outline-variant">
        <div class="md:col-span-4 flex flex-col gap-space-xs"><span class="font-headline-sm text-headline-sm text-primary uppercase">attics.std</span><span class="font-label-sm text-label-sm text-outline uppercase tracking-widest">STREETWEAR ARCHIVE • EDITION 2024</span></div>
        <div class="md:col-span-8 flex flex-wrap items-center justify-start md:justify-end gap-x-space-lg gap-y-space-xs">
          <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="home" href="#">HOME</a>
          <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="catalog" href="#">CATALOG</a>
          <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="product" href="#">PRODUCT</a>
          <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="contact" href="#">CONTACT</a>
          <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary uppercase" data-path="cart" href="#">CART</a>
        </div>
      </div>
      <div class="pt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm"><p class="font-label-sm text-label-sm text-outline uppercase tracking-wider">© 2024 ATTICS.STD STUDIO. ALL RIGHTS RESERVED.</p><p class="font-label-sm text-label-sm text-outline uppercase tracking-wider">TOKYO / LONDON / NEW YORK</p></div>
    </div>
  </footer>
`;

