USE recipes_db;

INSERT INTO products
    (name, calories, gluten_free, vegetarian, created_At, updated_At)
VALUES
    ("cilantro", 10, true, true, now(), now()),
    ("pistachios", 10, true, true, now(), now()),
    ("jalapeno", 10, true, true, now(), now()),
    ("garlic cloves", 10, true, true, now(), now()),
    ("lime", 10, true, true, now(), now()),
    ("olive oil", 10, true, true, now(), now()),
    ("salt", 10, true, true, now(), now()),
    ("black pepper", 10, true, true, now(), now()),
    ("shrimp", 10, true, false, now(), now()),
    ("Gluten Free Brown Rice Spaghetti", 10, true, true, now(), now()),
    ("goat cheese", 10, true, true, now(), now()),
    ("cauliflower", 10, true, true, now(), now()),
    ("sweet potato", 10, true, true, now(), now()),
    ("curry powder", 10, true, true, now(), now()),
    ("turmeric", 10, true, true, now(), now()),
    ("garlic powder", 10, true, true, now(), now()),
    ("red cayenne pepper", 10, true, true, now(), now()),
    ("dried cranberries", 10, true, true, now(), now()),
    ("frozen peas", 10, true, true, now(), now()),
    ("parsley", 10, true, true, now(), now()),
    ("tahini", 10, true, true, now(), now()),
    ("ginger", 10, true, true, now(), now()),
    ("green onion", 10, true, true, now(), now()),
    ("lemon juice", 10, true, true, now(), now());




INSERT INTO recipes
    (name, description, prep_time, rating, created_At, updated_At)
VALUES
    ("Cilantro Pistachio Pesto Shrimp Pasta",
        "Make the pesto by adding the following to the bowl of a food processor: cilantro, pistachios, jalapeño, garlic cloves, lime juice, olive oil, water and salt and pepper. Process until smooth, scraping down the sides and processing again, if necessary.
Next cook the shrimp: add olive oil to a large skillet or pan and place over medium high heat. Add in shrimp, garlic powder and salt and pepper; cook until shrimp is no longer pink. Remove from heat and set aside.
Cook the pasta until al dente, according to the directions on the package. Drain pasta, then add back to pot. Stir in the pesto and shrimp until well coated. Add pasta to bowls and garnish with goat cheese, a few 
cilantro leaves and a sprinkle of crushed pistachios. Serve immediately. Makes about 4 servings.",
        45, 5, now(), now());

INSERT INTO recipes
    (name, description, prep_time, rating, created_At, updated_At)
VALUES
    ("Curry Roasted Cauliflower Sweet Potato Salad",
        "Preheat oven to 350 degrees F. Place cauliflower florets and cubed sweet potatoes on a large baking sheet. Drizzle with olive oil, then sprinkle on curry powder, turmeric, garlic powder, red cayenne pepper and season with 
salt and pepper. Use clean hands to toss everything together until it’s well coated with oil and spices. Spread out evenly. Roast for 30 minutes, flipping halfway in between. We want the sweet potatoes to be somewhat fork tender but still have a slight bite.
Once done cooking, add roasted sweet potato and cauliflower to a medium bowl. Add in the thawed peas, green onion, cranberries, cilantro and parsley.
Make the dressing: In a small bowl, add in tahini, lemon juice, warm water, curry powder, garlic powder, ginger, turmeric, salt and pepper. Mix well to combine. Taste and adjust seasonings to your liking. Add more warm water if necessary to thin out the 
dressing so it is spoonable. Fold the dressing into the rest of the ingredients until they are well coated. Serves 2-4, depending on how hungry you are. Garnish with a few extra scallions, cranberries and cilantro.",
        50, 11, now(), now());


INSERT INTO ingredients
    (RecipeId, ProductId, amount, created_At, updated_At)
VALUES
    (1, 1, 0.5, now(), now()),
    (1, 2, 0.3, now(), now()),
    (1, 3, 1, now(), now()),
    (1, 4, 3, now(), now()),
    (1, 5, 0.5, now(), now()),
    (1, 6, 3.5, now(), now()),
    (1, 7, 0.5, now(), now()),
    (1, 8, 0.2, now(), now()),
    (1, 9, 1, now(), now()),
    (1, 10, 10, now(), now()),
    (1, 11, 0.25, now(), now()),
    (2, 12, 3.5, now(), now()),
    (2, 13, 3, now(), now()),
    (2, 6, 1, now(), now()),
    (2, 14, 1.5, now(), now()),
    (2, 15, 0.75, now(), now()),
    (2, 16, 0.75, now(), now()),
    (2, 17, 0.25, now(), now()),
    (2, 19, 0.7, now(), now()),
    (2, 23, 0.25, now(), now()),
    (2, 18, 0.3, now(), now()),
    (2, 1, 0.5, now(), now()),
    (2, 20, 0.25, now(), now()),
    (2, 21, 3, now(), now()),
    (2, 24, 0.5, now(), now()),
    (2, 22, 0.5, now(), now()),
    (2, 7, 0.5, now(), now()),
    (2, 8, 0.25, now(), now());
