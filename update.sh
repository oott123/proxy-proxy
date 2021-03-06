#!/bin/bash
# wget -O src/assets/temp-gfwlist.txt https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt

cp node_modules/futoin-ipset/dist/futoin-ipset.js lib/ipset.js
cp node_modules/vue/dist/vue.esm.browser.js lib/vue.jsm
cp node_modules/bulma/css/bulma.css lib/bulma.css

wget -O src/assets/chnroutes.txt https://lib.best33.com/share/loveroutes.txt 

tempname1=`mktemp`
tempname2=`mktemp`
tempname_all=`mktemp`
wget -O $tempname1 https://raw.githubusercontent.com/koolshare/koolshare.github.io/acelan_softcenter_ui/maintain_files/cdn.txt
wget -O $tempname2 https://raw.githubusercontent.com/felixonmars/dnsmasq-china-list/master/accelerated-domains.china.conf
sed -i 's#server=/##' $tempname2
sed -i 's#/114.114.114.114##' $tempname2

echo "koolshare lines: " `wc -l $tempname1`
echo "felixonmars lines: " `wc -l $tempname2`
cat $tempname1 $tempname2 | sort | uniq > $tempname_all
echo "sort and uniq lines: " `wc -l $tempname_all`

mv $tempname_all src/assets/cdn.txt


rm $tempname1 $tempname2
