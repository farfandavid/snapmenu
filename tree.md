```sh
src
├── client
│   ├── class
│   │   └── QrCode.ts
│   ├── config
│   │   └── firebaseClient.ts
│   ├── services
│   │   ├── menu-service.ts
│   │   └── products-service.ts
│   ├── types
│   │   ├── Interfaces.ts
│   │   ├── Options.ts
│   │   └── Preload.ts
│   └── utils
│       ├── constant.ts
│       ├── convert.ts
│       └── qr.ts
├── components
│   ├── assets
│   │   └── icons
│   │       ├── ClipboardFill.astro
│   │       ├── EnvelopeAtFill.astro
│   │       ├── Facebook.astro
│   │       ├── HouseFill.astro
│   │       ├── Instagram.astro
│   │       ├── List.astro
│   │       ├── PencilFill.astro
│   │       ├── Piggy.astro
│   │       ├── PostcardHeartFill.astro
│   │       ├── QRCodeScan.astro
│   │       ├── SearchHeart.astro
│   │       ├── Share.astro
│   │       ├── SvgQr.astro
│   │       └── Whatsapp.astro
│   ├── dashboard
│   │   ├── configPage
│   │   │   ├── ChangeName.astro
│   │   │   └── RenewPayment.astro
│   │   ├── FormCategory.tsx
│   │   ├── FormProduct.tsx
│   │   ├── HoursOpening.tsx
│   │   ├── Map.tsx
│   │   ├── MenuDash.tsx
│   │   ├── Modal.tsx
│   │   ├── PayementForm.astro
│   │   ├── Products.tsx
│   │   ├── ProductTable.tsx
│   │   └── UserMenus.astro
│   ├── default
│   │   ├── ButtonComponent.astro
│   │   ├── Container.astro
│   │   ├── InputComponent.astro
│   │   └── SelectComponent.astro
│   ├── Home
│   │   ├── About.astro
│   │   ├── Button.astro
│   │   ├── Contact.astro
│   │   ├── FunctionCard.astro
│   │   ├── Home.astro
│   │   └── Service.astro
│   └── seo
│       ├── RichResultMain.astro
│       ├── RichResultMenu.astro
│       └── SEO.astro
├── env.d.ts
├── layouts
│   ├── DashboardLayout.astro
│   ├── Layout.astro
│   └── MenuLayout.astro
├── middleware
│   ├── index.ts
│   └── playground-1.mongodb.js
├── models
│   └── paymentModel.js
├── pages
│   ├── 404.astro
│   ├── api
│   │   ├── auth
│   │   │   ├── register.ts
│   │   │   ├── signin.ts
│   │   │   └── signout.ts
│   │   ├── dashboard
│   │   │   ├── change-name.ts
│   │   │   ├── infoMenu.ts
│   │   │   ├── logo.ts
│   │   │   ├── menu
│   │   │   │   └── [menuId]
│   │   │   │       ├── categories.ts
│   │   │   │       ├── category.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── info-menu.ts
│   │   │   │       ├── product.ts
│   │   │   │       └── upload-image.ts
│   │   │   ├── portrait.ts
│   │   │   └── users
│   │   │       └── menus.ts
│   │   ├── email
│   │   │   └── server.ts
│   │   ├── payment
│   │   │   ├── create-order.ts
│   │   │   └── webhook.ts
│   │   └── test.ts
│   ├── auth
│   │   └── verify-email.astro
│   ├── dashboard
│   │   ├── config.astro
│   │   ├── edit-info.astro
│   │   ├── hourOpening.astro
│   │   ├── index.astro
│   │   ├── products.astro
│   │   └── qr-generator.astro
│   ├── health.astro
│   ├── index.astro
│   ├── [menu].astro
│   ├── privacy-policy.astro
│   ├── register.astro
│   ├── signin.astro
│   └── terms-of-service.astro
├── server
│   ├── class
│   │   ├── Menu.ts
│   │   └── User.ts
│   ├── config
│   │   ├── db.ts
│   │   ├── firebaseServer.ts
│   │   ├── mp.ts
│   │   └── s3.ts
│   ├── interface
│   │   ├── Menu.ts
│   │   ├── Payment.ts
│   │   └── User.ts
│   ├── models
│   │   ├── menuModel.ts
│   │   └── userModel.ts
│   └── utils
│       ├── constants.ts
│       └── Geo.ts
└── utils
    ├── mercadopagoValidator.ts
    ├── recaptcha.ts
    └── verifyAuth.ts
```