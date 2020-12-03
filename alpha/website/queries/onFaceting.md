Some thoughts on faceted search

VS perhaps a query build DSL

Is it really closed world?
How does it align with "give me a box"

Facet after the fact:

prefix schema: <https://schema.org/> 
SELECT ?type (count(distinct ?s) as ?scount)
WHERE {   
  {
       ?lit bds:search "lidar" .
       ?s ?p ?lit .
       ?s rdf:type ?type
       }
}
GROUP By ?type

prefix schema: <https://schema.org/> 
SELECT  ?kw (count(distinct ?s) as ?scount)
WHERE {   
  {
       ?lit bds:search "New Zealand" .
       ?s ?p ?lit .
       ?s schema:keywords ?kw
       }
}
GROUP By ?kw

prefix schema: <https://schema.org/> 
SELECT  ?vmname (count(distinct ?s) as ?scount)
WHERE {   
  {
       ?lit bds:search "New Zealand" .
       ?s ?p ?lit .
       ?s schema:variableMeasured ?vm .
       ?vm schema:name ?vmname .
       }
}
GROUP By ?vmname 
ORDER By DESC(?scount)


prefix schema: <https://schema.org/> 
SELECT  ?pubname (count(distinct ?s) as ?scount)
WHERE {   
  {
       ?lit bds:search "lidar" .
       ?s ?p ?lit .
       ?s schema:publisher ?pub .
       ?pub schema:name ?pubname .
       }
}
GROUP By ?pubname 
ORDER By DESC(?scount)

What about NER on descriptions  :)








prefix schema: <http://schema.org/> 
SELECT  ?s
WHERE {   
  {
       ?lit bds:search "Clear Creek Data" .
       ?s ?p ?lit .
       ?s rdf:type schema:Dataset
       }

}