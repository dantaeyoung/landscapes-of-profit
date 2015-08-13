-- add the BBL column
alter table acris_flips_names add column bbl bigint;

-- populate BBL
update acris_flips_names set bbl = (
      (borough::text || LPAD(block::text,5,'0') || LPAD(lot::text, 4, '0'))::bigint
   );

-- join acris data to map pluto
DROP TABLE IF EXISTS nyc_flips;
CREATE TABLE nyc_flips AS (
  SELECT a.council,
         a.zipcode,
         a.cd,
         a.address,
         a.ownername,
         a.zonedist1,
         a.zonedist2,
         a.allzoning1,
         a.allzoning2,
         a.landuse,
         a.yearbuilt,
         a.yearalter1,
         a.yearalter2,
         a.builtfar,
         a.residfar,
         a.commfar,
         a.facilfar,
         a.borocode,
         a.condono,
         a.tract2010,
         a.shape_area,
         a.geom,
         b.before_document_date,
         b.after_document_date,
         b.before_document_amt,
         b.after_document_amt,
         b.ratiopricediff,
         b.dayspast,
         b.bbl
  FROM acris_flips_names b, map_pluto_2015v1 a
  WHERE a.bbl = b.bbl
);

-- exclude transactions where profit < $100k and sale >= 5x than purchase.
SELECT * FROM nyc_flips WHERE (after_document_amt - before_document_amt) > 100000 AND (ratiopricediff < 5);

DELETE FROM nyc_flips
WHERE ((after_document_amt - before_document_amt) < 100000) OR (ratiopricediff > 5);

-- aggregate profit by council district
SELECT cast(flip.a::numeric as money) as after, 
       cast(flip.b::numeric as money) as before, 
       cast(((flip.a - flip.b)*0.01)::numeric as money) as flip_tax, 
       flip.total_flips,
       flip.council 
FROM (
   SELECT sum(after_document_amt) as a, 
          sum(before_document_amt) as b, 
          count(*) as total_flips,
          council 
   FROM nyc_flips
   WHERE (after_document_amt - before_document_amt) > 100000 AND (ratiopricediff < 5)
   GROUP BY council
) as flip
order by flip_tax desc

-- aggregate profit by council district, 2014 only
SELECT cast(flip.a::numeric as money) as after, 
       cast(flip.b::numeric as money) as before, 
       cast(((flip.a - flip.b)*0.01)::numeric as money) as flip_tax, 
       flip.total_flips,
       flip.council 
FROM (
   SELECT sum(after_document_amt) as a, 
          sum(before_document_amt) as b, 
          count(*) as total_flips,
          council 
   FROM nyc_flips
   WHERE after_document_date >= '2014-01-01' AND after_document_date <= '2014-12-31'
   GROUP BY council
) as flip
order by flip_tax desc

-- aggregate by zipcode, include # of flips
SELECT cast(flip.a::numeric as money) as after, 
       cast(flip.b::numeric as money) as before, 
       cast(((flip.a - flip.b)*0.01)::numeric as money) as flip_tax, 
       flip.total_flips,
       flip.zipcode
FROM (
   SELECT sum(after_document_amt) as a, 
          sum(before_document_amt) as b, 
          count(*) as total_flips,
          zipcode 
   FROM nyc_flips
   WHERE (after_document_amt - before_document_amt) > 100000 AND (ratiopricediff < 5)
   GROUP BY zipcode
) as flip
order by flip_tax desc
