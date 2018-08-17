class ShelvesController < ApplicationController
  def index
    @shelves = current_user.shelves
    @shelf = Shelf.new
    respond_to do |format|
      format.html { render :index } 
      format.json { render json: @shelves }
    end
  end

  def create 
    shelf = Shelf.new(shelf_params)
    if current_user.has_shelf?(shelf)
      redirect_to user_shelves_path(current_user), notice: "You already have a shelf with this name."
    else 
      shelf.save 
      redirect_to user_shelves_path(current_user, anchor: "#{shelf.id}")
    end
  end 

  def edit
    @shelves = current_user.shelves
    @shelf = Shelf.find(params[:id])
    render :index
  end 

  def update
    shelf = Shelf.find(params[:id])
    old_name = shelf.name
    shelf.name = params[:shelf][:name]
    if current_user.has_shelf?(shelf) && old_name != shelf.name
      shelf.name = old_name
      shelf.save
      redirect_to user_shelves_path(current_user), notice: "You already have a shelf with this name."
    else   
      shelf.save  
      redirect_to user_shelves_path(current_user, anchor: "#{shelf.id}")
    end
  end

  def destroy
    shelf = Shelf.find(params[:id])
    name = shelf.name
    shelf.books.destroy_all
    shelf.destroy
    redirect_to user_shelves_path(current_user), notice: "#{name} Shelf has been deleted."
  end

  private
    def shelf_params
      params.require(:shelf).permit(:name, :user_id)
    end
end
