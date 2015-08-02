#!/bin/bash
# merge the individual borough MapPLUTO shapefiles and import into PostgreSQL / PostGIS
# requires: gdal / ogr2ogr, postgresql, postgis
# run this script inside a folder containing individual folders of shapefiles for each borough

file='./map_pluto_2015v1.shp' # name of output merged shapefile file
base=`basename $file .shp` # strips $file of '.shp' extension
db='nyc_pluto' # postgresql database name

# find all the MapPLUTO shapefiles and iterate over them
for i in `find . -name '*MapPLUTO*.shp'`;
do

if [ -f "$file" ]
  then
    # append the other shapefiles 
    echo "transforming and merging $i" 
    ogr2ogr -f 'ESRI Shapefile' \
            -s_srs EPSG:2263 \
            -t_srs EPSG:4326 \
            -skipfailures -update -append $file $i -nln $base
  else
    # create the file to append others to
    echo "creating $file"
    ogr2ogr -f 'ESRI Shapefile' \
            -s_srs EPSG:2263 \
            -t_srs EPSG:4326 \
            -skipfailures $file $i
fi

done

# check our merged data
echo "printing $file properties"
ogrinfo -al -so $file

# to do: add a step here to pause the script to make sure the output from above looks good!

# import data into postgres (requires a PostGIS extension to be enabled on the db)
shp2pgsql -s 4326 $file $base $db | psql -d $db