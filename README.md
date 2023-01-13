# USAGE

# from source

    npm install

# build windows exe

    ./build-windows.sh

# parameters

    Options:
    --dataPath <datapath>      path of xml files (default: "./")
    --fileFilter <fileFilter>  file filter patter (regexp) (default: ".*")
    --output <output>          output sql file (default: "out.sql")
    --tablePrefix <output>     sql table prefix (default: "test_")

# example 

    - only one file, prefix table with test_, output in mysql.sql
    node src/x2sql.js --dataPath=data --fileFilter=ID1_AHA --tablePrefix='test_' --output=mySql.sql

    - all files in data diretory
    x2sql.exe --dataPath=data

