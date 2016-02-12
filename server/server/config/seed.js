/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Employee from '../api/employee/employee.model';
import Counter from '../api/counter/counter.model';
import Department from '../api/department/department.model';
import Item from '../api/item/item.model';


Thing.find({}).removeAsync()
  .then(() => {
    Thing.create({
      name: 'Alex',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, and Less.',
      active:true,
      admin:true,
      code:null
    }, {
      name: 'Rick',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.',
      active:true,
      admin:true,
      code:null
    }, {
      name: 'Sam',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html',
      active:true,
      admin:false,
      code:"3123"
    }, {
      name: 'Mike',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability',
      active:true,
      admin:false,
      code:null
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.',
      active:true,
      admin:false,
      code:null
    }, {
      name: 'Bob',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators',
      active:true,
      admin:true,
      code:null
    });
  });

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });

Employee.find({}).removeAsync()
  .then(() => {
    //   Employee.createAsync({
    //     name: 'Alex',
    //     role: 'admin'
    // }, {
    //     name: 'Mike',
    //     accessCode: '1231'
    // })
    // .then(() => {
    //   console.log('finished populating employees');
    // });
  });

  // Department.find({}).removeAsync()
  // .then(() => { });

  //Item.find({}).removeAsync();

  Counter.count({})
    .then(count => {
      if(!count){
        Counter.createAsync({
          _id: 'departmentMerchandiseCode',
          seq: 100
        }, {
          _id: 'itemID',
          seq: 1000
        })
        .then(() => {
          console.log('finished populating Counter');
        });
      }
    })
    .catch(err => next(err));
