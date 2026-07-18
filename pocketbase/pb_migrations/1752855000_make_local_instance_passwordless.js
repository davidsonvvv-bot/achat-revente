migrate((app) => {
  ;["vehicles", "repairs", "costs", "sales", "vehicle_photos"].forEach((name) => {
    const collection = app.findCollectionByNameOrId(name)
    collection.listRule = ""
    collection.viewRule = ""
    collection.createRule = ""
    collection.updateRule = ""
    collection.deleteRule = ""
    collection.fields.getByName("owner").required = false
    app.save(collection)
  })
}, (app) => {
  const rule = "@request.auth.id != '' && owner = @request.auth.id"
  const createRule = "@request.auth.id != '' && @request.body.owner = @request.auth.id"
  const updateRule = "@request.auth.id != '' && owner = @request.auth.id && @request.body.owner:changed = false"
  ;["vehicles", "repairs", "costs", "sales", "vehicle_photos"].forEach((name) => {
    const collection = app.findCollectionByNameOrId(name)
    collection.listRule = rule
    collection.viewRule = rule
    collection.createRule = createRule
    collection.updateRule = updateRule
    collection.deleteRule = rule
    collection.fields.getByName("owner").required = true
    app.save(collection)
  })
})
