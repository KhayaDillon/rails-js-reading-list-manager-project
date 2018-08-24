class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  before_action :authenticate_user!

  def flash_to_headers
    return unless request.xhr?
    response.headers['X-Message'] = flash[:notice]  unless flash[:notice].blank?
    response.headers['X-Message'] = flash[:alert]  unless flash[:alert].blank?
    # repeat for other flash types...
  
    flash.discard  # don't want the flash to appear when you reload page
  end
  
  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit :sign_up, keys: [:name]
    devise_parameter_sanitizer.permit :account_update, keys: [:name]
  end

end
