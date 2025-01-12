const express = require('express');
const Item = require('../models/itemModel'); 
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const userData = await Item.find(); 
        return res.status(200).send(userData);
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).send({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newItem = new Item(req.body); 
        const savedItem = await newItem.save(); 
        return res.status(201).send({ message: "Data inserted successfully", savedItem });
    } catch (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await Item.deleteOne({ _id: id }); 
        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ message: "Item not found" });
        }
        return res.status(200).send({ message: "Deleted successfully", deleteResult });
    } catch (err) {
        console.error("Error deleting item:", err);
        return res.status(500).send({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateResult = await Item.updateOne({ _id: id }, { $set: req.body }); 
        if (updateResult.modifiedCount === 0) {
            return res.status(404).send({ message: "Item not found or no changes made" });
        }
        return res.status(200).send({ message: "Updated successfully", updateResult });
    } catch (err) {
        console.error("Error updating item:", err);
        return res.status(500).send({ message: err.message });
    }
});

module.exports = router;
