## Layout

apps/api/src/
  index.ts
  app.ts
  db/
  lib/errors.ts
  middleware/auth.ts
  modules/
    auth/     routes.ts controller.ts service.ts repository.ts
    users/
    events/     comments live here
    photos/
    stats/

## Routes

Public reads: map, event, comments, photo bytes, ranking, active user list, public profile.
POST   /auth/register
POST   /auth/login
POST   /auth/logout          requireUser
GET    /auth/me              requireUser

GET    /users                active only, for the filter chips
GET    /users/:username
GET    /admin/users          requireAdmin, ?status=pending
POST   /admin/users/:id/approve
POST   /admin/users/:id/reject

GET    /events               ?userIds&from&to
GET    /events/:id           event + comments + photo ids
POST   /events               requireActive
PATCH  /events/:id           requireActive, owner
DELETE /events/:id           requireActive, owner
POST   /events/:id/comments  requireActive
DELETE /comments/:id         requireActive, author

POST   /events/:id/photos    requireActive
GET    /photos/:id           file bytes
DELETE /photos/:id           requireActive, uploader

GET    /stats/ranking
GET    /stats/users/:username