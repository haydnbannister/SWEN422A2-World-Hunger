import os
from os import listdir
from os.path import isfile, join
import commands
import csv
import math 

dic = {"AF":"Africa", "AS":"Asia", "NA":"North America", "SA":"South America", "EU":"Europe"}



def fix_data():
    countries, continents = load_continents()
    command = ""
    for filen in listdir('.'):
        if(filen != 'data_fixer.py' and filen != 'Hunger.csv' and filen != 'continent_table.csv'):
            fix_file(filen, countries, continents)


def fix_file(filename, countries, continents):

    new_rows = []
    new_rows.append(["Country","Country Code","Continent Code", "Percent","Millions","Continent Name"])
    
    with open(filename, 'rb') as csvfile:
        scan = csv.reader(csvfile, delimiter=',')
        scan.next()
        for row in scan:
            new_row = []
            new_row.append(row[0])
            new_row.append(row[1])
            new_row.append(continents[countries.index(row[1])])
            new_row.append(row[3])
            new_row.append(row[4])
            new_row.append(dic[new_row[2]])
            new_rows.append(new_row)
            
    
    with open(filename, 'wb') as csvfile:
        write = csv.writer(csvfile, delimiter=',')
        for row in new_rows:
            write.writerow(row)


def load_continents():
    countries = []
    continents = []
    
    with open('continent_table.csv', 'rb') as csvfile:
        scan = csv.reader(csvfile, delimiter='\t')
        for row in scan:
            countries.append(row[2])
            continents.append(row[0])
        print countries
        print continents

    return countries, continents




fix_data()
