require('dotenv').config()
var restify = require('restify');
const axios = require('axios').default
const Sequelize = require("sequelize");
const cron = require('node-cron')
const xlsx = require('node-xlsx')
const ls = require('./localization/' + (process.env.LOCALE || 'kr'))
process.env.WHATAP_NAME = 'api-sample1-{ip2}-{ip3}-{pid}'
const agGridServer = require('./util/agGridServer')


var PORT = process.argv[2] || process.env.SERVICE_PORT || 12006
var server = restify.createServer()
let isDisableKeepAlive = false


const sq = new Sequelize(process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD == '' ? null : process.env.DB_PASSWORD,
  {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      timezone: '+09:00', // 타임존을 설정
      dialect: 'mysql',
      dialectOptions: {
          dateStrings: true,
          typeCast: true,
      },
      define: {
          charset: 'utf8',
          collate: 'utf8_general_ci',
      },
      pool: {
          min: 1,
          max: 10,
          idle: 5000,
      },
      logging: process.env.NODE_ENV == 'prod' ? false : console.log 
  }
)

const { Book } = require('./book')(sq)
const { User } = require('./user')(sq)
const { Entity } = require('./models/entity')(sq)
const { Outlet } = require('./models/outlet')(sq)
const { POINTHISTORY } = require('./models/point_history')(sq)
const { UserRweard } = require('./models/user_reward')(sq)

const DB = {
    sq,
    Book,
    User,
    Entity,
    Outlet,
    POINTHISTORY,
    UserRweard
  }

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function dbrespond(req, res, next) {
  if (process.env.SYNC_DB == '2') {
    sq.sync({ force: true }).then(function () {
        console.log("All models were synchronized successfully.")
    })
}
res.send('hello ' + req.params.name);
next();
}

function bookfind(req, res) 
{
  let car = req.body;
  console.log('car........',car);
  let sameCar = DB.Book.findOne({
    where: { serialNo: req.body.sno }
})
res.send({ status: 200, code: '00', message: 'success',sameCar:sameCar })
}

async function userInfoFromUserId(req, res, next) {
  if (req.header('userId') == '') {
      throw { status: 400, code: '98', message: 'userId is required' }
  }
  let e, r = await DB.sq.query(`SELECT * FROM book WHERE userId = '${req.header('userId')}'`)
  req.userInfo = r[0][0]
  console.log("req",req.body)
  console.log(req.userInfo)
  next()
}
async function badgeUpdate(req, res, next) {
  try {
      if (req.userInfo == null) {
          throw { status: 401, code: '97', message: ls.errorAuth }
      }
      console.log("req",req)
      let sameCar = await DB.Book.findOne({
        where: { serialNo: 'asdf' }
    })

      res.send({ status: 200, code: '00', message: 'success',sameCar:sameCar })
  } catch (err) {
      //errorHandler.handleError(err, res),
      console.log(err)
  }
}

function axiosrespond(req, res, next) {
    let outputResponse ;
    try { 
        const res = axios.get('http://localhost:8080/hello/venkat');
        console.log("no 1 not working"); 
        console.log(res); 
        } catch (err) { 
        console.error(err); 
        } 
  
    axios.get('http://localhost:8080/hello/venkat')
  .then(function (response) {
    // handle success
    outputResponse = response.data;
    console.log('no2');
    console.log(outputResponse);
    //console.log(outputResponse.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
    console.log('final');
    res.send('output '+outputResponse);
    next();
  });
  

  
  }


//ROUTER FILES:
var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.get('/db/:name', dbrespond);
server.head('/db/:name', dbrespond);

server.get('/axios/:name', axiosrespond);
server.head('/axios/:name', axiosrespond);

server.get('/api/:apiname', userInfoFromUserId);
server.head('/api/:apiname', userInfoFromUserId);

server.post('/user/api/badge-update', userInfoFromUserId, badgeUpdate);

server.post('/bookfind',bookfind)
server.head('/bookfind', bookfind);

server.post('/book/:bookId', function (req, res, next) {
console.log('bookid............',req.body.sno);
res.send('Welcome ' + req.params.bookId);
 })

 server.pre(function(req, res, next) {
  req.headers.accept = 'application/json';
  return next();
});

server.use(restify.plugins.bodyParser())

server.post(
    '/foo/:id',
    function(req, res, next) {
        console.log('Authenticate');
        return next();
    },
    function(req, res, next) {
        //res.send('Welcome ' + req.params.id);
        let v =  req.body;
        console.log('Success', v.sno);
        

        const data = [
          [1, 2, 3],
          [true, false, null, 'sheetjs'],
          ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
          ['baz', null, 'qux'],
        ];
        var buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer
        console.log('buffer', buffer);
        res.send('Welcome ' + req.body);
        return next();
    }
);

//Partner table.

server.post('/partner/admin/entity-create',  async (req, res) => {
  try {
     

      let userInfo = req.body.userInfo;

      if ( !userInfo?.entityName) {
          throw { status: 400, code: '98', message: ls.requiredEntityName };
      }
      if ( !userInfo?.name) {
          throw { status: 400, code: '98', message: ls.requiredName };
      }
      if ( !userInfo?.email) {
          throw { status: 400, code: '98', message: ls.requiredEmail };
      }
      if ( !userInfo?.phoneNumber) {
          throw { status: 400, code: '98', message: ls.requiredPhoneNumber };
      }
      if ( !userInfo?.designation) {
          throw { status: 400, code: '98', message: ls.requiredDesignation };
      }

      let entity = await DB.Entity.create({
          partnerId: userInfo.partnerId,
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          designation: userInfo.designation,
          entityName: userInfo.entityName,
          status: userInfo.status
      });

      if ( entity?.dataValues == null) {
          throw { status: 400, code: '98', message: ls.errorRetry }
      }

      res.send({ status: 200, code:'00', message: ls.saveMsg })
  } catch (err) {
      errorHandler.handleError(err, res)
  }
})
server.post('/partner/admin/entity-select-list', async (req, res) => {

  try{
  let r = await DB.Entity.findAll({
      attributes: [
          'partnerId', 'entityId', 'entityName', 'name', 'email', 'phoneNumber', 'designation', 'status', 'createdAt', 'totalBalance',
          [DB.sq.literal('(select count(*) from outlet  where entityId = Entity.entityId)'), 'outlet'],
      ],
      where: { partnerId: req.body.partnerId },
      order: [
          ['createdAt', 'DESC']
      ]
  });

  console.log('entry-selected list for partner...')
  res.send({ code:'00', data: r })
}catch(err)
{
  console.log(err)
}
})

//AMR...
server.post('/point/admin/transaction-excel', async (req, res, next) => {
  try {
      if (!req.adminInfo) {
          //throw { status: 401, code: '97', message: ls.errorAuth }
      }

      req.body['customCols'] = [
          { field: '*' },
          { field: 'select status from user_reward where orderId = vantagelocal.point_history.orderId', alias: 'rewardStatus' },
      ]

      if (req.body.filterModel.createdAt) {
          req.body.filterModel = {
              ...req.body.filterModel,
              createdAt: {
                  ...req.body.filterModel.createdAt,
                  customFormat: 1
              },
          }
      }

      /*
      if (req.adminInfo.partnerId) {
          req.body.filterModel = {
              ...req.body.filterModel,
              partnerId: {
                  filterType: 'text',
                  type: 'equals',
                  filter: req.adminInfo.partnerId
              }
          }
      }
      */
      req.body.sortModel = [{ sort: 'desc', colId: 'createdAt' }, ...req.body.sortModel]

      let result = (await agGridServer.getData('vantagelocal.point_history', req.body)).resultsForPage
      let keys = Object.keys(result[0])
      // ws.addRow(keys)
      if (req.body.masking) {
          for (let i = 0; i < result.length; i++) {
              if (result[i].email) {
                  result[i].email = maskingEmailCount(result[i].email, 3)
              }
              if (result[i].phone) {
                  result[i].phone = maskingPhone(result[i].phone)
              }
          }
      }
      if (1) {
          const csv = parse(result, { encoding: 'utf8', ...keys })
          res.set({
              'Content-Type': 'text/csv;charset=utf-8',
              'Content-Disposition': 'attachment; filename=customer_list.csv'
          })
          res.send('\ufeff' + csv)
      }
      console.debug('excel download end')
  } catch (err) {
      //errorHandler.handleError(err, res)
      console.log(err)
  }
})

server.listen(PORT, '0.0.0.0', function () {
  //process.send('ready')
  if (process.env.SYNC_DB == '2') {
    sq.sync({ force: true }).then(function () {
        console.log("All models were synchronized successfully.")
    })
}
  console.log('%s listening at %s', server.name, server.url)
})