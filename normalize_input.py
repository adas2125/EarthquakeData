import unidecode

# reading from earthquake_data.csv and writing to out.csv
with open('earthquake_data.csv', 'r', encoding='utf-8') as input, open('out.csv', 'w', encoding='utf-8') as output:
    for line in input:
        # normalize the line so it can be encoded in ASCII and write to output
        normalized_line = unidecode.unidecode(line)
        output.write(normalized_line)

