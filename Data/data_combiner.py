import os
import numpy as np

def getCountries(path):
    list = os.listdir(path)
    list.remove("Hunger.csv")
    list.sort()

    global data
    data = []
    countries = []

    # Collect all 16 data files, one per year, and create Numpy Arrays from each csv
    for file in list:
        my_data = np.genfromtxt(path+"/"+file, delimiter=',', dtype=str)
        data.append(my_data)

    # Eliminates the double case of Congo data field
    for i in range(0, data.__len__()):
        for j in range(0, data[i].__len__()):
            if "COD" in data[i][j]:
                data[i][j] = None

    # Create an exhaustive list of countries (not every year has a field for every country)
    for i in range(0, data.__len__()):
        for j in range(0, data[i].__len__()):
            if [data[i][j][0], data[i][j][1], data[i][j][2], data[i][j][5]] not in countries:
                countries.append([data[i][j][0], data[i][j][1], data[i][j][2], data[i][j][5]])

    # Remove the header
    countries.remove(["Country","Country Code","Continent Code", "Continent Name"])

    # Sort the countries by name and create a new constructed list of countries
    countries.sort()
    construct = countries.copy()
    missing = True

    # For each country find its data within each file and append the percentage and millions values
    # to that country's row.
    for country in countries:
        for i in range(0, data.__len__()):
            for countryrow in data[i].tolist():
                if country[0] in countryrow:
                    construct[countries.index(country)].append(countryrow[3])
                    construct[countries.index(country)].append(countryrow[4])
                    missing = False
            # If a given country is not present in a given year, a value of 0.0 is used to fill the missing data field
            if missing:
                construct[countries.index(country)].append('0.0')
                construct[countries.index(country)].append('0.0')
            missing = True

    # Reconstruct the header for the new CSV
    header = ["Country", "Country Code", "Continent Code", "Continent Name",
              "p2000", "m2000",
              "p2001", "m2001",
              "p2002", "m2002",
              "p2003", "m2003",
              "p2004", "m2004",
              "p2005", "m2005",
              "p2006", "m2006",
              "p2007", "m2007",
              "p2008", "m2008",
              "p2009", "m2009",
              "p2010", "m2010",
              "p2011", "m2011",
              "p2012", "m2012",
              "p2013", "m2013",
              "p2014", "m2014",
              "p2015", "m2015"
              ]
    construct.insert(0, header)
    final = []

    # Take the data and reconstruct it into the form required for a CSV, each instance
    # tuple (one for each country) of data becomes a formatted string
    for row in construct:
        newrow = ""
        for value in row:
            if newrow == "":
                newrow = value
            else:
                newrow = newrow+","+value
        newrow += "\n"
        final.append(newrow)

    # Create a new file and output the final array as a CSV
    f = open("output.csv", "w")
    for line in final:
        if "None" in line:
            continue
        f.write(line)


if __name__ == '__main__':
    getCountries("/Users/Hunter/PycharmProjects/databuilder/data")