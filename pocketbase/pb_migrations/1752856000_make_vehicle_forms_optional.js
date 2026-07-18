migrate((app) => {
  const optional = {
    vehicles: ["brand", "model", "mileage", "purchase_date", "purchase_price"],
    repairs: ["title", "repair_date", "amount"],
    costs: ["title", "amount", "cost_date"],
    sales: ["sale_date", "sale_price", "sale_mileage"],
    vehicle_photos: ["image"],
  }

  Object.entries(optional).forEach(([collectionName, fieldNames]) => {
    const collection = app.findCollectionByNameOrId(collectionName)
    fieldNames.forEach((fieldName) => { collection.fields.getByName(fieldName).required = false })
    app.save(collection)
  })
}, (app) => {
  const required = {
    vehicles: ["brand", "model", "mileage", "purchase_date", "purchase_price"],
    repairs: ["title", "repair_date", "amount"],
    costs: ["title", "amount", "cost_date"],
    sales: ["sale_date", "sale_price", "sale_mileage"],
    vehicle_photos: ["image"],
  }

  Object.entries(required).forEach(([collectionName, fieldNames]) => {
    const collection = app.findCollectionByNameOrId(collectionName)
    fieldNames.forEach((fieldName) => { collection.fields.getByName(fieldName).required = true })
    app.save(collection)
  })
})
