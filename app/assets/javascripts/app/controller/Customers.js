Ext.define('AM.controller.Customers', {
  extend: 'Ext.app.Controller',

  stores: ['Customers'],
  models: ['Customer'],

  views: [
    'customer.List',
    'customer.Form'// ,
    // 	'Cardpanel',  
    // 	'user.DepartmentManager',
    // 	'user.EmployeeManager'
  ],

  	refs: [
		{
			ref: 'list',
			selector: 'customerlist'
		} 
	],

  init: function() {
    this.control({
      'customerlist': {
        itemdblclick: this.editUser,
        selectionchange: this.selectionChange
      },
      'customerform button[action=save]': {
        click: this.updateUser
      },
      'customerlist button[action=addUser]': {
        click: this.addUser
      },
      'customerlist button[action=editUser]': {
        click: this.editUser
      },
      'customerlist button[action=deleteUser]': {
        click: this.deleteUser
      } 
		
    });
  },
 

  addUser: function() {
		console.log("Gonna Add User");
    var view = Ext.widget('customerform');
    view.show();
  },

  editUser: function() {
		console.log("event listener editUser");
    var record = this.getList().getSelectedUser();
		if( record ) {
			console.log("The name is " + record.get("name"));
		}
    var view = Ext.widget('customerform');
		if( view ) {
			console.log("The view is not nil");
		}
    view.down('form').loadRecord(record);
// view.show();
  },

  updateUser: function(button) {
		console.log("Gonna Call update user");
    var win = button.up('window');
    var form = win.down('form');

    var store = this.getCustomersStore();
    var record = form.getRecord();
    var values = form.getValues();

		
		if( record ){
			console.log("Update action");
			record.set( values );
			 
			form.setLoading(true);
			record.save({
				success : function(record){
					form.setLoading(false);
					console.log("UPDATE is successful");
					//  since the grid is backed by store, if store changes, it will be updated
					store.load();
					win.close();
				},
				failure : function(record,op ){
					form.setLoading(false);
					console.log("UPDATE is a failure");
					var message  = op.request.scope.reader.jsonData["message"];
					var errors = message['errors'];
					form.getForm().markInvalid(errors);
				}
			});
				
			 
		}else{
			//  no record at all  => gonna create the new one 
			console.log("NO USER. GONNA CREATE");
			var me  = this; 
			var newObject = new AM.model.Customer( values ) ;
			
			// learnt from here
			// http://www.sencha.com/forum/showthread.php?137580-ExtJS-4-Sync-and-success-failure-processing
			// form.mask("Loading....."); 
			form.setLoading(true);
			newObject.save({
				success: function(record){
					console.log("This is successful");
					//  since the grid is backed by store, if store changes, it will be updated
					store.load();
					form.setLoading(false);
					win.close();
					
				},
				failure: function( record, op){
					form.setLoading(false);
					console.log("This is a failure");
					var message  = op.request.scope.reader.jsonData["message"];
					var errors = message['errors'];
					form.getForm().markInvalid(errors);
				}
			});
		} 
  },

  deleteUser: function() {
    var record = this.getList().getSelectedUser();

    if (record) {
      var store = this.getCustomersStore();
      store.remove(record);
      store.sync();
// to do refresh programmatically
		this.getList().query('pagingtoolbar')[0].doRefresh();
    }

  },

  selectionChange: function(selectionModel, selections) {
    var grid = this.getList();

    if (selections.length > 0) {
      grid.enableRecordButtons();
    } else {
      grid.disableRecordButtons();
    }
  }

});
