class CreateCustomers < ActiveRecord::Migration
  def change
    create_table :customers do |t|

      t.integer :creator_id 
      
      t.string  :name
      t.string  :contact_person
      
      t.string  :mobile
      t.string  :phone
      t.string  :bbm
      
      t.string  :office_address 
      
      t.integer :town_id
      
      t.timestamps
    end
  end
end
