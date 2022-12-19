$(() => {
let listCoins = ['ltc-litecoin', 'btc-bitcoin', 'eth-ethereum', 'doge-dogecoin'];
let listCoinPairs = ['LTC/USDT', 'BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
generateSelectCoin();
function generateSelectCoin() {
    listCoins.forEach(function (el, indexCoin) {
        let option = document.createElement('option');
        option.innerHTML = el;
        option.setAttribute('value', indexCoin);
        document.querySelector('#coin').append(option);
    });

}
/*
let whiteListMarket = ['Binance', 'Kucoin'];
let blackListMarket = ['GokuMarket', 'BitGlobal'];//скам
let volumeMin = 340785;
let list = [];
getListMarketCoin(0);
function getListMarketCoin(id) {
    let x = new XMLHttpRequest();
    let url = "https://api.coinpaprika.com/v1/coins/"+listCoins[id]+"/markets";
    console.log(url);
    x.open("GET", url, true);
    x.onload = function (){
        list = JSON.parse(x.responseText);
        document.querySelectorAll('.market_coin').forEach(function (el) {
            el.remove();
        });
        list.forEach(viewMarketPrice);
        sortRow(3, 1);
    }
    x.send(null);
}

function viewMarketPrice(item) {
    if (blackListMarket.indexOf(item.exchange_name) === -1) //скам
    if ((listCoinPairs.indexOf(item.pair) > -1) && item.market_url !== null && item.quotes.USD.volume_24h > volumeMin) {
        //console.log(item);

        let div = document.createElement('tr');
        div.setAttribute('class', 'market_coin');
        if (whiteListMarket.indexOf(item.exchange_name) > -1) {
            div.classList.add('white');
        }
        div.innerHTML = "<td>"+item.exchange_name+"</td><td>"+item.pair+"</td><td><a href='"+item.market_url+"' target='_blank'>"+item.market_url+"</a></td><td>"+item.quotes.USD.price+"</td><td>"+item.quotes.USD.volume_24h+"</td>";

        document.querySelector('.list_market').querySelector('tbody').append(div);
    }
}*/


document.querySelector('#reloadPrice').addEventListener('click', function (event) {
    loadAllMarket();
});
document.querySelector('#reloadGraf').addEventListener('click', function (event) {
    findPathInGraf();
});
document.querySelector('#viewFoundChain').addEventListener('click', function (event) {
    document.querySelector('#status_load').innerHTML = 'Start view chains...';
    document.querySelectorAll('.market_coin').forEach(function (el) {
        el.remove();
    });
    getResultListCoin(resultListCoin[startCoinGlobal]);
    document.querySelector('#status_load').innerHTML = 'end view chains!';
});
$(document).on('click', '.button_update', function (event) {
    let pairs = $(this).data('pair').split(',');
    let thisLink = $(this);
    thisLink.parents('tr').find('.result_update .content').remove();

    viewActualPrice(thisLink, pairs, startCoinGlobal, startMoneyGlobal);

    event.preventDefault();
});

async function viewActualPrice(thisLink, pairs, coin, money) {
    let result = [];
    pairs.forEach((pair, iPair) => {
        let url = 'http://createwebpages.ru/crypto/load.php?url=https://api.binance.com/api/v3/depth?symbol='+pair;
        let x = new XMLHttpRequest();
        x.open("GET", url, true);
        x.onload = function (){
            let list = JSON.parse(x.responseText);
            let strAsks = '';
            let i = 0;
            list.asks.forEach((ask) => {
                if (i++ < 5) {
                    strAsks += '<p>' + ask[0] + ' ' + ask[1] + '</p>';
                }
            });
            let strBids = '';
            i = 0;
            list.bids.forEach((bid) => {
                if (i++ < 5) {
                    strBids += '<p>' + bid[0] + ' ' + bid[1] + '</p>';
                }
            });
            result[iPair] = {};
            result[iPair].pair = pair;
            result[iPair].ask1 = list.asks[0][0];
            result[iPair].bid1 = list.bids[0][0];
            result[iPair].strAsks = strAsks;
            result[iPair].strBids = strBids;
        }
        x.send(null);
    });

    setTimeout(() => {
        result.forEach((el) => {
            // console.log(coin);
            // console.log(el.pair);
            // console.log(el.pair.indexOf(coin));
            let typeMathOperation = el.pair.indexOf(coin) === 0 ? 'multiply' : el.pair.indexOf(coin) > -1 ? 'divide' : 'false';
            coin = el.pair.replace(coin, '');

            let newMoney = el.ask1;
            let bidOrAsk = '';
            if (typeMathOperation === 'multiply') {
                bidOrAsk = 'ask';
                newMoney = money * el.ask1;
            } else {
                bidOrAsk = 'bid';
                newMoney = money / el.bid1;
            }
            let str = '<div class="content"><p>'+el.pair+' ('+typeMathOperation+': ('+bidOrAsk+'))<br>m:'+money+'<br>nm:'+newMoney+'</p><div class="list"><div>'+el.strAsks+'</div><div>'+el.strBids+'</div></div></div>';

            money = newMoney;
            thisLink.parents('tr').find('.result_update').append(str);
        });
    }, 1200);

    return result;
}


/**********************************/
/**********************************/
/***************Market api****************/
/**********************************/
/**********************************/
let listCoin = {};//список всех монет
let listCoinWithPairs = {};//список всех монет включающих пары
let listPrice = [];//список всех пар
// let listUrl = [ 'https://api.binance.com/api/v3/ticker/price', 'https://api.binance.us/api/v3/ticker/price',];
let listUrl = [ 'https://api.binance.com/api/v3/ticker/bookTicker'];
let listMarket = ['BinanceUS', 'Binance'];
let listCoinApprove = ['USDT', 'LTC', 'BTC', 'DOGE', 'ETH',/* 'BNB',*/ 'XRP', 'ADA', 'MATIC', 'DOT', 'TRX', 'SOL', 'SHIB', 'UNI', 'AVAX', 'WBTC', 'LINK', 'XMR', 'ATOM', 'ALGO'];
//loadAllMarket();
function loadAllMarket() {
    getListAllCoin();
}

function viewPairs() {
    document.querySelectorAll('.market_coin').forEach(function (el) {
        el.remove();
    });

    let namePair = listCoinPairs[document.querySelector('#coin').value].replace('/','');
    for (const market in listPrice[namePair]) {
        console.log("viewPairs(): "+listMarket[market]);
        viewPrice(namePair, market);
    }
}

function getListAllCoin() {
    listCoin = {};
    listCoinWithPairs = {};
    let listPrice = [];
    document.querySelector('#status_load').innerHTML = 'Start load coin...';
    let url = 'http://createwebpages.ru/crypto/load.php?url=https://api.coinpaprika.com/v1/coins';
    console.log("GET: "+url);
    let x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.onload = function (){
        list = JSON.parse(x.responseText);
        list.forEach(function(el, indexCoin) {
            if (el.symbol && el.symbol.length > 1 && el.is_active === true) {
                if (typeof listCoin[el.symbol] === 'undefined') {
                    listCoin[el.symbol] = el.symbol;
                }
            }
        });
        let size = Object.keys(listCoin).length;
        document.querySelector('#status_load').innerHTML = 'end load coin ('+size+')! Start load price...';
        getListCoin(0);
    }
    x.send(null);
}
function getListCoin(idMarket) {
    let url = 'http://createwebpages.ru/crypto/load.php?url=' + listUrl[idMarket];// + '?symbols=["ETHUSDT","ETHBTC","BTCDAI","BTCUSDT","ADABIDR"]';
    console.log("GET: "+url);
    let x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.onload = function (){
        list = JSON.parse(x.responseText);
        list.forEach(function(el, indexCoin) {
            if (el.askPrice > 0 && el.askPrice > 0.00001) {
                // let approveCoin = false;
                // //console.log(el.symbol);
                // for (const coin in listCoinApprove) {
                // 	//console.log(listCoinApprove[coin]);
                // 	//console.log(el.symbol.indexOf(listCoinApprove[coin]));
                // 	if (el.symbol.indexOf(listCoinApprove[coin]) > -1) {
                // 		approveCoin = true;
                // 		break;
                // 	}
                // }
                // if (approveCoin)
                {


                    if (typeof listPrice[el.symbol] === 'undefined') {
                        listPrice[el.symbol] = {};
                    }
                    if (typeof listPrice[el.symbol][idMarket] === 'undefined') {
                        listPrice[el.symbol][idMarket] = {};
                    }
                    listPrice[el.symbol][idMarket].price = el.askPrice;
                    listPrice[el.symbol][idMarket].askPrice = el.askPrice;
                    listPrice[el.symbol][idMarket].bidPrice = el.bidPrice;

                    let i = 0;
                    let sizeSymbol = el.symbol.length;
                    for (let k in listCoin) {
                        let indexOfCoin = el.symbol.indexOf(k);
                        if (indexOfCoin > -1) {
                            let sizeCoin = k.length;
                            // if (indexOfCoin === 0 || indexOfCoin === sizeSymbol - sizeCoin)
                            {
                                if (typeof listCoinWithPairs[k] === 'undefined') {
                                    listCoinWithPairs[k] = [el.symbol];
                                } else {
                                    listCoinWithPairs[k].push(el.symbol);
                                }
                                if (typeof listPrice[el.symbol].parentCoin === 'undefined') {
                                    listPrice[el.symbol].parentCoin = [k];
                                } else {
                                    if (listPrice[el.symbol].parentCoin.length < 2) {
                                        listPrice[el.symbol].parentCoin.push(k);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        console.log(listCoinWithPairs);
        console.log(listPrice);
        let size = Object.keys(listPrice).length;
        console.log('end load file with '+size+' symbols.');
        document.querySelector('#status_load').innerHTML = 'end load price with '+size+' symbols.. Pls next generate graf!';
        $('#reloadGraf').show();
    }
    x.send(null);
}

function viewPrice(namePair, market) {
    let item = listPrice[namePair][market];
    let div = document.createElement('tr');
    div.setAttribute('class', 'market_coin');

    div.innerHTML = "<td>"+listMarket[market]+"</td><td>"+namePair+"</td><td><a href='' target='_blank'></a></td><td>"+item.price+"</td><td></td>";

    document.querySelector('.list_market').querySelector('tbody').append(div);
}
/**********************************/
/**********************************/
/***************Market api****************/
/**********************************/
/**********************************/


/**********************************/
/**********************************/
/***************find path in Graf****************/
/**********************************/
/**********************************/
listPriceTest = {
    'LTCUSDT': [{
        'price': 72.96
    },{
        'price': 72.86
    }],
    'LTCBTC': [{
        'price': 0.00418300
    },{
        'price': 0.00438300
    }],
    'BTCUSDT': [{
        'price': 17424.06000000
    },{
        'price': 17434.06000000
    }],
    'LTCDOGE': [{
        'price': 847.76
    },{
        'price': 847.96
    }],
    'DOGEUSDT': [{
        'price': 0.08647
    },{
        'price': 0.08747
    }],
    'DOGEBTC': [{
        'price': 0.00000495
    },{
        'price': 0.00000496
    }],
};
let skipCoins = ['NGN', 'XRPUP', 'ETHDOWN', 'BNBUP', 'LINKDOWN', 'UPUSDT', 'DOWNUSDT',
    /*'USD', 'BUSD', 'BUSDT', 'BBUSD', 'TUSD', 'UST', 'VEN', 'LUNA', 'SUN', 'COCOS', 'BEAM', 'BTS', 'PAX', 'TCT',
'IDRT', 'USDC', 'COMP', 'IRIS', 'NBT', 'BCN', 'TOMO', 'REP', 'AIONBNB', 'BCC', 'MCO', 'XEM', 'BALBNB', 'ZRXBNB', 'NPXS',
'HC', 'STORM', 'ALGOBIDR', 'HOTBTC', 'UNIAUD', 'MFTBTC', 'SPELL', 'BTG', 'ARDRETH', 'BTT', 'NULSETH', 'BCHSV', 'LEND',
'NBS', 'GTO', 'NGN', 'MBL', 'SUSD', 'ANY', 'BZR', 'DOCKETH', 'NU', 'BZRX', 'KEEP', 'BKRW', 'STRAT', 'GXS', 'SHIBUAH',
'FRONTETH', 'RGT', 'BCHABC', 'ATOMBIDR', 'DOGEBNB', 'NANO', 'WINBTC', 'EPS', 'XZC', 'MITH', 'USDS', 'SNGLS', 'YOYO',
'HSR', 'BQX', 'SNM', 'SALT', 'MDA', 'SUB', 'SNT', 'DF', 'TRIBE', 'REQETH', 'WTCETH', 'DAIBTC', 'KEYBTC', 'AVAXBIDR',
'VGX', 'ERD', 'VOXELETH', 'PERL', 'DYDXETH', 'KMDETH', 'STORJETH', 'SYSETH', 'RCN', 'CND', 'NXS', 'SKY'*/];
listPriceTest = listPrice;
//100usdt to LTCUSDT 100/72.96 = 1.37ltc to LTCBTC 1.37*0.004183 = 0.00573btc to BTCUSDT 0.00573*17424.06 = 99.85usdt
let globalLvl = 4;
let startCoinGlobal = 'USDT';
let endCoinGlobal = 'USDT';
let startMoneyGlobal = 100;//usdt
let resultListCoin = {};
let iGlobalResultList = 0;
let nextPairCount = 0;
//findPathInGraf();
function findPathInGraf() {
    document.querySelector('#status_load').innerHTML = 'Start generate graf...';
    let dateTime = Date.now();
    console.log("findPathInGraf() START...");
    //console.log("listPriceTest:", listPriceTest);
    resultListCoin[startCoinGlobal] = findNextPair(startCoinGlobal, startMoneyGlobal, 0, startCoinGlobal);
    //console.log("resultListCoin: ", resultListCoin[startCoinGlobal]);
    let timeWork = ((Date.now() - dateTime) / 1000);
    console.log('findPathInGraf() END (time: '+timeWork+'s, count: '+nextPairCount+')');
    document.querySelector('#status_load').innerHTML = 'end generate graf! (time: '+timeWork+'s, count: '+nextPairCount+')';
    $('#viewFoundChain').show();
}

function findNextPair(coin, money, lvl, beforeCoin, beforePair, beforeCourse) {
    lvl++;
    if (lvl === 3)//globalLvl-1)
    {
        console.log('findNextPair START: ' + lvl + '===============');
    }
    // console.log('findNextPair coin('+coin+') beforeCoin('+beforeCoin+') START: '+lvl+'===============');
    if (typeof beforeCoin === 'undefined') {
        beforeCoin = '';
    }
    if (typeof beforePair === 'undefined') {
        beforePair = '';
    }
    if (typeof beforeCourse === 'undefined') {
        beforeCourse = '';
    }
    let resultListCoin = {};
    let i = 0;
    for (const keyCoin in listCoinWithPairs[coin]) {
        nextPairCount++;
        let pair = listCoinWithPairs[coin][keyCoin];
        // for (const pair in listPriceTest) {
        i++;
        // if (i > 300) {
        // 	break;
        // }
        let typeMathOperation = pair.indexOf(coin) === 0 ? 'multiply' : pair.indexOf(coin) > -1 ? 'divide' : 'false';
        if (typeMathOperation !== 'false') {
            // console.log('pair lvl('+lvl+'): ',pair)
            /*console.log("----------");
            console.log(pair);
            console.log(listPriceTest[pair]);
            console.log(pair.indexOf(coin));
            console.log(typeMathOperation);*/
            let startCoin = pair.replace(coin, '');
            if ((beforeCoin.indexOf(startCoin) === -1 || startCoin === endCoinGlobal && coin !== endCoinGlobal) && skipCoins.indexOf(startCoin) === -1 && skipCoins.indexOf(pair) === -1) {
                //console.log(startCoin);
                //console.log(startCoin+": "+skipCoins.indexOf(startCoin));
                //console.log(startCoin+": yes");
                /*console.log("=====beforeCoin S=====");
                console.log(coin);
                console.log(beforeCoin);
                console.log(beforeCoin.indexOf(coin));
                console.log("=====beforeCoin E=====");*/
                if (typeof listPriceTest[pair][0] !== 'undefined') {
                    let startMoney = listPriceTest[pair][0].price;//TODO: переделать на несколько бирж, пока только первая
                    let price = 0;
                    if (typeMathOperation === 'multiply') {
                        startMoney = money * listPriceTest[pair][0].askPrice;
                        price = 'a:' + listPriceTest[pair][0].askPrice;
                    } else {
                        startMoney = money / listPriceTest[pair][0].bidPrice;
                        price = 'b:' + listPriceTest[pair][0].bidPrice;
                    }
                    let newBeforeCoin = beforeCoin+', '+startCoin;
                    let newBeforePair = beforePair+', '+pair;
                    let newBeforeCourse = beforeCourse+', '+price;
                    resultListCoin[pair] = {
                        'type': typeMathOperation,
                        'lvl': lvl,
                        'startCoin': startCoin,
                        'beforeCoin': newBeforeCoin,
                        'beforeCourse': newBeforeCourse,
                        'beforePair': newBeforePair,
                        'course': listPriceTest[pair][0].price,//TODO: переделать на несколько бирж, пока только первая
                        'startMoney': startMoney,
                        'startMoney2': startCoin != endCoinGlobal,
                        'nextDeep': startCoin != endCoinGlobal && lvl < globalLvl ? findNextPair(startCoin, startMoney, lvl, newBeforeCoin, newBeforePair, newBeforeCourse) : {},
                        //'nextDeep': lvl > 2 ? {} : findNextPair(startCoin, startMoney, lvl),
                    };
                }
            }
        }
    }
    //console.log('findNextPair END: '+lvl+'===============');
    return resultListCoin;
}

function getResultListCoin(resultListCoin) {
    //for (const coin in resultListCoin) {
    for (const pair in resultListCoin) {
        let element = resultListCoin[pair];
        if (element.startCoin === endCoinGlobal) {
            var count = (element.beforeCoin.match(/\,/g) || []).length;
            if (count > 2 && element.startMoney > startMoneyGlobal+2 && element.startMoney < startMoneyGlobal+100) {
                iGlobalResultList++;
                let div = document.createElement('tr');
                div.setAttribute('class', 'market_coin');
                let arrayBeforePair = element.beforePair.split(', ').filter((pair) => {
                    return pair !== '' ? pair : false;
                })
                let href = 'http://createwebpages.ru/crypto/load.php?url=https://api.binance.com/api/v3/ticker/bookTicker?symbols=["'+arrayBeforePair.join('","')+'"]';
                div.innerHTML = "<td>("+iGlobalResultList+") "+startMoneyGlobal+"</td><td>"+element.startCoin+"</td><td><p>Count pair: "+arrayBeforePair.length+"</p><p>"+arrayBeforePair.join(', ')+"</p><p>"+element.beforeCourse+"</p></td><td>"+element.startMoney+"</td><td><a class='button_update' data-pair='"+arrayBeforePair.join(',')+"' href='"+href+"' target='_blank'>Свежие данные</a></td><td><div class='result_update'></div></td>";
                document.querySelector('.list_pair_sequence').append(div);
            }
        } else {
            getResultListCoin(element.nextDeep);
        }
    }
    //}
}
/**********************************/
/**********************************/
/***************find path in Graf****************/
/**********************************/
/**********************************/




/**********************************/
/**********************************/
/***************Сортировка****************/
/**********************************/
/**********************************/
document.querySelectorAll('table').forEach(function(table){
    //let table = document.querySelector('table');
    let sort = [];
    function sortRow(indexTh, type) {
        if (typeof type !== "undefined") {
            sort[indexTh] = type;
        } else {
            if (typeof sort[indexTh] === "undefined") {
                sort[indexTh] = -1;
            } else {
                sort[indexTh] = (-1*sort[indexTh]);
            }
        }
        let sortedRows = Array.from(table.rows)
            .slice(1)
            .sort((rowA, rowB) => {
                let a = rowA.cells[indexTh].innerHTML;
                let b = rowB.cells[indexTh].innerHTML;
                if (parseFloat(a) == a && parseFloat(b) == b) {
                    a = parseFloat(a);
                    b = parseFloat(b);
                }
                return a > b ? sort[indexTh] : (-1*sort[indexTh])
            });

        table.tBodies[0].append(...sortedRows);
        if (indexTh == 3) {
            viewRangeCost();
        }
    }

    function viewRangeCost() {
        let sortedRows = Array.from(table.rows);
        let minCost = parseFloat(sortedRows[1].querySelectorAll('td')[3].innerHTML);//1 - минус шапка, 3 - 4ый столбец
        let maxCost = parseFloat(sortedRows[sortedRows.length-1].querySelectorAll('td')[3].innerHTML);
        if (minCost > maxCost) {
            let cost = minCost;
            minCost = maxCost;
            maxCost = cost;
        }
        let diff = (1 - (minCost / maxCost)) * 100;

        document.querySelector('#diffCourseMarket').innerHTML = diff + "%";
    }

    table.querySelectorAll('th').forEach(function (el, indexTh) {
        el.addEventListener('click', function (event) {
            sortRow(indexTh);
        });
    });
})

document.querySelector('#coin').addEventListener('change', function (event) {
    //getListMarketCoin(parseInt(this.value));
    viewPairs();
});
/**********************************/
/**********************************/
/***************Сортировка****************/
/**********************************/
/**********************************/

});
