# SPARQL

## About 

This directory contains some of the SPARQL queries used by GeoCODES.

Production queries are at: https://github.com/earthcube/facetsearch/tree/master/src/sparql 

You can run these at the command line using various libraries
and packages.  For this example, the Apache Jena package is 
show. [Download Jena](https://jena.apache.org/) and set it up.  You will need to set the 
JENAROOT and extend your PATH variable. 


```bash
➜  SPARQL git:(master) ✗ export JENAROOT=~/bin/jena
➜  SPARQL git:(master) ✗ export PATH=$JENAROOT/bin:$PATH
➜  SPARQL git:(master) ✗ which rsparql
~/bin/jena/bin/rsparql
➜  SPARQL git:(master) ✗ rsparql --service http://graph.geodex.org/blazegraph/namespace/nabu/sparql --query geodex_nabuRR.rq 
```

## References

* [Jena command line cheat sheat](http://richard.cyganiak.de/blog/wp-content/uploads/2013/09/jena-sparql-cli-v1.pdf)
  