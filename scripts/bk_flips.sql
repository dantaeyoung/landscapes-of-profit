-- flips in Brooklyn
CREATE TABLE bk_flips AS (
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
  FROM acris_flips_bbl b, bk2015v1 a
  WHERE a.bbl = b.bbl
);