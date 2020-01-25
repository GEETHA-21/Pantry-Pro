//
// Set image source, either local or remote url
//
function fixRecipeImage(recipe) {
	recipe.imageSrc = (recipe.image) ?
		`data:image/jpeg;base64, ${recipe.image.toString("base64")}` :
		recipe.imageURL;
	recipe.image = null;
	recipe.imageURL = null;
	
	return recipe;
}

module.exports = fixRecipeImage;
