import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeDto } from 'src/app/Classes/RecipeDto';
import { StepItem } from 'src/app/Classes/StepItem';
import { TagItem } from 'src/app/Classes/TagItem';
import { IngredientItem } from 'src/app/Classes/IngredientItem';
import { ProductItem } from 'src/app/Classes/ProductItem';

var recipeDtoById: RecipeDto;

@Component({
  selector: 'app-change-recipe-page',
  templateUrl: './change-recipe-page.component.html',
  styleUrls: ['./change-recipe-page.component.css']
})
export class ChangeRecipePageComponent implements OnInit {

  recipeDtosById: RecipeDto[] = [];

  private _http: HttpClient;

  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router)
  {
    this._http = http;
  }
  
  currentRecipeDtoName = '';
  currentRecipeDtoDescription = '';
  currentRecipeDtoPersonNumber = 1;
  currentRecipeDtoCookingTime = 1;
  currentRecipeDtoLikes = 0;
  currentRecipeDtoStars = 0;
  currentRecipeDtoIsLiked = "../../../assets/like.svg";

  currentStepItemNumber = 1;
  currentStepItemName = '';
  steps: StepItem[] = [];

  currentTagItemName = '';
  tags: TagItem[] = [];
  StringTags: string[] =[];

  StringProducts: string[] = []
  currentIngredientItemName = '';
  currentProductItemName = '';
  Products: ProductItem[] = [];
  ingredientItems: IngredientItem[] = [];
  joinProducts = '';
  newProducts: ProductItem[] = [];

  currentRecipeDtoId = 0;

  async ngOnInit(): Promise<void>
  {
    this.currentRecipeDtoId = Number(this.route.snapshot.paramMap.get('id'));
    recipeDtoById = await this._http.get<RecipeDto>('/api/Recipe/' + this.currentRecipeDtoId).toPromise();
    this.recipeDtosById.push(recipeDtoById);
    this.currentRecipeDtoName = recipeDtoById.recipeName;
    this.currentRecipeDtoDescription = recipeDtoById.recipeDescription;
    this.currentRecipeDtoPersonNumber = recipeDtoById.personNumber;
    this.currentRecipeDtoCookingTime = recipeDtoById.cookingTime;
    this.currentRecipeDtoLikes = recipeDtoById.likes;
    this.currentRecipeDtoStars = recipeDtoById.stars;
    this.steps = recipeDtoById.steps;
    this.tags = recipeDtoById.tags;
    this.ingredientItems = recipeDtoById.ingredientItems;

    for (let i = 0; i < this.steps.length; i++)
    {
      this.steps[i].StepNumber = i + 1;
    }

    let counter = this.ingredientItems.length;

    for (let i = 0; i < counter; i++)
    {
      this.StringProducts[i] = this.ingredientItems[i].products.join('\n');
      let newProduct: ProductItem = new ProductItem(this.StringProducts[i]);
      this.newProducts.push(newProduct);
      let newIngredientItem: IngredientItem = new IngredientItem(this.ingredientItems[i].ingredientItemName, this.newProducts)
      this.ingredientItems.push(newIngredientItem);
      this.ingredientItems.splice(0, 1);
    }
    console.log(this.ingredientItems);
  }
  
  async updateRecipe(recipe: RecipeDto)
  {
    await this._http.put(`/api/Recipe/${recipe.recipeId}`, recipe).toPromise();
    this.router.navigate(['/'])
  }

  async deleteRecipe()
  {
    await this._http.delete<RecipeDto>('/api/Recipe/' + this.currentRecipeDtoId).toPromise();
    this.router.navigate(['/'])
  }

  deleteStep(){
    this.steps.pop();
  }

  async addStepItem() {
      this.currentStepItemNumber = this.steps.length + 1;
      let newStep: StepItem = new StepItem(this.currentStepItemName, this.currentStepItemNumber);

      this.steps.push( newStep );
      this.currentStepItemName = '';
  }

  async addTagItem() {
    this.tags = [];
    let i = 0;
    this.StringTags = this.currentTagItemName.split(' ');

    while (i < this.StringTags.length) { 
      this.currentTagItemName = this.StringTags[i];
      let newTag: TagItem = new TagItem(this.currentTagItemName);
      this.tags.push( newTag );
      i++;
    }
    
    this.currentTagItemName = '';
  }

  async addIngredientItem() {
    let i = 0;
    this.StringProducts = this.currentProductItemName.split('\n');

    while (i < this.StringProducts.length - 1) { 
      this.currentProductItemName = this.StringProducts[i];
      let newProductItem: ProductItem = new ProductItem(this.currentProductItemName);
      this.Products.push( newProductItem );
      i++;
    }

    let newIngredientItem: IngredientItem = new IngredientItem(this.currentIngredientItemName, this.Products)
    this.ingredientItems.push(newIngredientItem)
  }

  async ChangeRecipeDto()
  {
    this.addTagItem();
    let newRecipeDto: RecipeDto = new RecipeDto(
    this.currentRecipeDtoId,
    this.currentRecipeDtoName,
    this.currentRecipeDtoDescription,
    this.currentRecipeDtoPersonNumber,
    this.currentRecipeDtoCookingTime,
    this.currentRecipeDtoLikes,
    this.currentRecipeDtoIsLiked,
    this.currentRecipeDtoStars,
    this.steps,
    this.tags,
    this.ingredientItems);
    
    this.updateRecipe(newRecipeDto)
  }

}
