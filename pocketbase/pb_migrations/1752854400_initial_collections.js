migrate((app) => {
  const ownedRule = "@request.auth.id != '' && owner = @request.auth.id"
  const ownedCreateRule = "@request.auth.id != '' && @request.body.owner = @request.auth.id"
  const ownedUpdateRule = "@request.auth.id != '' && owner = @request.auth.id && @request.body.owner:changed = false"

  const users = new Collection({
    type: "auth",
    name: "app_users",
    listRule: "id = @request.auth.id",
    viewRule: "id = @request.auth.id",
    createRule: null,
    updateRule: "id = @request.auth.id",
    deleteRule: "id = @request.auth.id",
    passwordAuth: { enabled: true, identityFields: ["email"] },
    fields: [{ name: "name", type: "text", max: 120 }],
  })
  app.save(users)

  const owner = () => ({ name: "owner", type: "relation", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true })
  const base = (name, fields) => new Collection({
    type: "base",
    name,
    listRule: ownedRule,
    viewRule: ownedRule,
    createRule: ownedCreateRule,
    updateRule: ownedUpdateRule,
    deleteRule: ownedRule,
    fields: [owner(), ...fields],
  })

  const vehicles = base("vehicles", [
    { name: "brand", type: "text", required: true, max: 80 },
    { name: "model", type: "text", required: true, max: 100 },
    { name: "trim", type: "text", max: 120 },
    { name: "year", type: "number", min: 1900, max: 2100 },
    { name: "fuel", type: "text", max: 40 },
    { name: "transmission", type: "text", max: 40 },
    { name: "mileage", type: "number", required: true, min: 0 },
    { name: "purchase_date", type: "date", required: true },
    { name: "purchase_price", type: "number", required: true, min: 0 },
    { name: "target_price", type: "number", min: 0 },
    { name: "registration", type: "text", max: 30 },
    { name: "vin", type: "text", max: 40 },
    { name: "seller", type: "text", max: 120 },
    { name: "seller_phone", type: "text", max: 40 },
    { name: "description", type: "text", max: 5000 },
    { name: "notes", type: "text", max: 5000 },
    { name: "status", type: "select", required: true, maxSelect: 1, values: ["Acheté", "En préparation", "En réparation", "Prêt à vendre", "En vente", "Réservé"] },
    { name: "main_photo", type: "file", maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
  ])
  app.save(vehicles)

  const vehicleRelation = () => ({ name: "vehicle", type: "relation", required: true, maxSelect: 1, collectionId: vehicles.id, cascadeDelete: true })
  const repairs = base("repairs", [
    vehicleRelation(),
    { name: "title", type: "text", required: true, max: 160 },
    { name: "description", type: "text", max: 5000 },
    { name: "repair_date", type: "date", required: true },
    { name: "amount", type: "number", required: true, min: 0 },
    { name: "provider", type: "text", max: 160 },
    { name: "status", type: "select", required: true, maxSelect: 1, values: ["À faire", "En cours", "Terminée"] },
    { name: "attachment", type: "file", maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"] },
  ])
  app.save(repairs)

  const costs = base("costs", [
    vehicleRelation(),
    { name: "title", type: "text", required: true, max: 160 },
    { name: "category", type: "select", required: true, maxSelect: 1, values: ["Transport", "Contrôle technique", "Homologation", "Carburant", "Nettoyage", "Publicité", "Pièces", "Taxe", "Autre"] },
    { name: "amount", type: "number", required: true, min: 0 },
    { name: "cost_date", type: "date", required: true },
    { name: "comment", type: "text", max: 5000 },
  ])
  app.save(costs)

  const sales = base("sales", [
    vehicleRelation(),
    { name: "sale_date", type: "date", required: true },
    { name: "sale_price", type: "number", required: true, min: 0 },
    { name: "buyer_name", type: "text", max: 160 },
    { name: "buyer_phone", type: "text", max: 40 },
    { name: "sale_mileage", type: "number", required: true, min: 0 },
    { name: "comment", type: "text", max: 5000 },
  ])
  sales.indexes = ["CREATE UNIQUE INDEX idx_sales_vehicle ON sales (vehicle)"]
  app.save(sales)

  const vehiclePhotos = base("vehicle_photos", [
    vehicleRelation(),
    { name: "image", type: "file", required: true, maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
    { name: "sort_order", type: "number", min: 0 },
    { name: "caption", type: "text", max: 280 },
  ])
  app.save(vehiclePhotos)
}, (app) => {
  ;["vehicle_photos", "sales", "costs", "repairs", "vehicles", "app_users"].forEach((name) => {
    try { app.delete(app.findCollectionByNameOrId(name)) } catch (_) {}
  })
})
