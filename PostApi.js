const express = require('express');
const Inventory = require('./Schema');

const app = express();
app.use(express.json());

// API route to modify inventory
app.post('/inventory', async (req, res) => {
  try {
    const payload = req.body;

    for (let i = 0; i < payload.length; i++) {
      const { productId, quantity, operation } = payload[i];
      
      // Fetching inventory for given product id
      const inventory = await Inventory.findOne({ productId });

      if (operation === 'add') {
        // Adding quantity to inventory if the product already exists
        if (inventory) {
          inventory.quantity += quantity;
          await inventory.save();
        } else {
          // Creating new inventory entry if product doesn't exist
          const newInventory = new Inventory({
            productId,
            quantity,
          });
          await newInventory.save();
        }
      } else if (operation === 'subtract') {
        // Subtracting quantity from inventory if the product exists
        if (inventory) {
          inventory.quantity -= quantity;
          await inventory.save();
        } else {
          res.status(404).send(`Product with id ${productId} not found in inventory`);
        }
      } else {
        res.status(400).send(`Invalid operation ${operation} for product ${productId}`);
      }
    }

    res.send('Inventory modified successfully!');
  } catch (error) {
    console.error('Error modifying inventory: ', error.message);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
