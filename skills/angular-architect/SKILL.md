---
name: angular-architect
description: Plan and build Angular 21 feature-first apps with standalone components, signals, Angular Material, SCSS, reactive forms, and lazy loading. Use when designing structure, scaffolding features, or making non-trivial Angular changes in this repo.
---

# Angular Architect

## When to invoke

- New Angular feature or route
- Refactor that touches module/folder layout
- State management decision (signals vs service vs RxJS)
- Dependency or library add (Material module, CDK, etc.)
- Performance or bundle-shape concern (lazy loading, code split)

## Stack baseline (this repo)

- Angular 21, TypeScript strict
- Standalone components only — no NgModules
- Signals for component/local state; services for shared state
- Angular Material for UI primitives
- SCSS, BEM-ish naming, one design-token file
- Reactive Forms (`FormBuilder`, typed `FormGroup`)
- Lazy loading per feature via `loadComponent` / `loadChildren`
- HTTP via `inject(HttpClient)` inside services; components never call HTTP direct

## Plan before change

Before edit, state:

1. **Goal** — one sentence, what user-visible outcome
2. **Files** — exact paths, new vs modified
3. **Architecture** — standalone component, signal/service shape, lazy boundary, Material components used
4. **Data** — service method, DTO/interface, validation rules
5. **Risk** — breaking change, bundle impact, migration step
6. **Verification** — `ng build`, `ng test`, manual flow

Wait for go-ahead on non-trivial work. Trivial fixes (typo, import) skip plan.

## Feature-first layout

```
src/app/
  core/                  # singletons: http interceptor, error handler, app config
  shared/                # reusable presentational components, directives, pipes
  features/
    <feature>/
      <feature>.routes.ts
      <feature>.page.ts           # routed entry, dumb or smart
      components/                 # feature-scoped dumb components
      services/                   # feature-scoped data services
      models/                     # interfaces, DTOs, enums
      pages/                      # if multiple screens
  app.routes.ts          # top-level, lazy-loads each feature
```

One folder per feature. Cross-feature reuse goes to `shared/`, not back into another feature.

## Conventions

- File name = kebab-case. Class name = PascalCase. Selector prefix `app-`.
- Component suffix reflects role: `.page` (routed), `.component` (presentational), `.dialog` (Material dialog host), `.form` (reactive form host).
- Public API surface: `@Input()` as `input()` signal, `@Output()` as `output()`. No two-way `@Input()/@Output()` pairs.
- Change detection: `OnPush` by default. Use `effect()` for cross-signal reactions, not manual `ngOnInit` plumbing.
- Templates: control flow with `@if` / `@for` / `@switch` (Angular 17+). No `*ngIf` / `*ngFor`.
- Forms: typed reactive forms. `FormControl<string>` not `FormControl<any>`. Validators as exported consts, not inline lambdas, when reused.
- SCSS: one `tokens.scss` for color/space/type. Components import it, never hardcode values. No deep selector chains (`>>>` / `::ng-deep`) unless overriding third-party (Material).
- Material: import only the components used (`MatButtonModule` etc.), not full `MatModule`. Theming via `mat.theme()` in `styles.scss`.

## Lazy loading

- Every feature route loads via `loadChildren: () => import('./features/x/x.routes').then(m => m.ROUTES)`.
- Single-screen features use `loadComponent` on the route, no extra routes file.
- Shared code imported by two+ features lives in `shared/`; do not import across `features/`.

## State rules

- Component-local UI state → signal inside the component.
- Feature-shared state → service with signals, `providedIn: 'root'` or feature-scoped provider.
- Server state → service with `httpResource` (Angular 21) or `HttpClient` + signals. Cache per service, not per component.
- No NgRx, no RxJS subjects for state that signals handle. RxJS only for event streams that aren't state (debounced search input piped to HTTP, etc.).

## Change size

- One concern per change. Refactor + feature in same diff = hard review.
- New feature = new folder + new routes entry + new service. Don't piggyback on existing feature folder.
- If change touches >5 files or >200 lines, split it.

## Verification

- `ng build` clean before commit.
- `ng test` for any service, form, or non-trivial component logic.
- Manual: run dev server, exercise create/edit/transition flow end-to-end.

## Don't

- Don't introduce NgModules.
- Don't add `*ngIf` / `*ngFor` / `*ngSwitch`.
- Don't put HTTP calls in components.
- Don't share state via `@Input` + service field mutation across components — use signal-backed service.
- Don't deep-import Material internals or override with `::ng-deep` when a theming token exists.
