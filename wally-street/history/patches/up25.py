import json
p='/mnt/user-data/outputs/stockgpt.html'
h=open(p,encoding='utf8').read()
def rep(old,new):
    global h
    assert h.count(old)==1,(h.count(old),old[:60]);h=h.replace(old,new)
EXG=[
["Inflation","A general rise in prices over time, so each dollar buys less. Investors try to earn returns that beat inflation."],
["Dollar-cost averaging (DCA)","Investing a fixed amount on a regular schedule, whatever the price. You buy more shares when prices are low and fewer when they are high, which smooths out your average cost."],
["Interest rate","The price of borrowing money, shown as a percentage. When central banks raise rates, borrowing costs more and bond yields usually rise. Stocks, especially fast-growing ones, can come under pressure."],
["Recession","A broad, lasting fall in economic activity: less output, fewer jobs and less spending. A common rule of thumb is two quarters in a row of shrinking GDP, though official calls vary by country."],
["EPS (earnings per share)","A company's profit divided by its number of shares. It is the E in the P/E ratio."],
["Stock split","A company divides each share into several, for example 10-for-1. The price per share falls but the total value of your holding stays the same."],
["S&P 500","An index of about 500 large US companies, weighted by size. It is often used as a stand-in for the US stock market."],
["Nasdaq","A US stock exchange known for technology companies. The Nasdaq-100 index tracks 100 of its biggest non-financial firms."],
["Dow Jones Industrial Average","An index of 30 large US companies, weighted by share price. It is one of the oldest market gauges."],
["Rebalancing","Adjusting your investments back to your target mix, for example selling some winners and buying laggards when stocks have grown to be more of your portfolio than you planned."],
["Compound interest (compounding)","Earning returns on your earlier returns. Growth speeds up over time, which is why starting early matters."],
["401k and IRA (retirement accounts)","In the US, accounts that give tax advantages for retirement saving. They have limits and rules, including penalties for early withdrawals. Other countries have their own versions. This is general education, not tax advice."],
["Broker","A company that lets you buy and sell investments. Compare fees, regulation and investor protection before choosing one."],
["Market order","An order to buy or sell right now at the best available price. It fills quickly, but the price can differ from the last one you saw."],
["Limit order","An order to buy or sell only at your chosen price or better. It may never fill if the market does not reach your price."],
["Pump and dump","A scam where people hype a cheap stock to push the price up, then sell their own shares to the buyers who rushed in. It is illegal."],
["Day trading","Buying and selling within the same day to profit from small moves. It is high risk, and studies of retail day traders often find that most lose money."],
["Swing trading","Holding a position for days or weeks to catch a bigger price swing. It is less hectic than day trading but still carries risk."],
["Scalping","Making many very quick trades for tiny profits each time. Fees and spreads can eat up the gains."],
["Index fund","A fund that copies an index, such as the S&P 500, instead of picking stocks. It is usually low cost and widely diversified."],
["Cryptocurrency and Bitcoin","A digital asset recorded on a blockchain instead of being issued by a government. Prices can swing wildly, and it lacks the protections of bank deposits."],
["Stock exchange","A marketplace where buyers and sellers trade shares, such as the NYSE, Nasdaq, Tokyo Stock Exchange or NSE in India."],
["Risk tolerance","How much loss you can handle, financially and emotionally, without panic selling. It should shape your mix of investments."],
["Emergency fund","Cash set aside, often three to six months of expenses, so you never have to sell investments at a bad time."],
["Capital gains","The profit when you sell an investment for more than you paid. Tax rules depend on your country and on how long you held it."],
["Market maker","A firm that is always ready to buy and sell a stock, which keeps trading smooth. It earns the small gap between the buy and sell price."],
]
assert len(EXG)==26
rep("const EXF=[","const EXG="+json.dumps(EXG,ensure_ascii=False)+";\nconst MKB={NVDA:'designs graphics chips and the AI processors behind many data centers',MSFT:'makes Windows, Office and the Azure cloud',TSLA:'makes electric cars and energy storage',AAPL:'makes the iPhone, Mac and a large services business',GOOGL:'owns Google, YouTube and Google Cloud',AMZN:'runs the online store and the AWS cloud',META:'owns Facebook, Instagram and WhatsApp',AVGO:'makes semiconductors and infrastructure software',LLY:'is a major drug maker',JPM:'is the largest US bank by assets','BRK.B':'is the holding company run by Warren Buffett',WMT:'is the world\\'s largest retailer by revenue'};\nconst EXF=[")
rep("EXF.concat(SECX).forEach(m=>D.push({h:m[0],b:m[1],k:(m[0]+' '+m[1]).toLowerCase(),x:6}));",
"EXF.concat(SECX,EXG).forEach(m=>D.push({h:m[0],b:m[1],k:(m[0]+' '+m[1]).toLowerCase(),x:6}));\n MK.forEach(m=>{const nm=m[1].split(' · ')[0];D.push({h:nm+' ('+m[0]+')',b:(MKB[m[0]]?nm+' '+MKB[m[0]]+'. ':'')+'You can practice-trade it in the Paper Exchange. Open the Practice tab to see its chart. This is for learning, not a recommendation.',k:(nm+' '+m[0]).toLowerCase(),x:8})});")
open(p,'w',encoding='utf8').write(h)
open('/mnt/user-data/outputs/stockgpt-share.html','w',encoding='utf8').write(h)
print(len(h))
