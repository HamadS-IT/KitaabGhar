
with open(r"stopwords.txt","r",encoding='utf-8') as R:
    stopwords = [i.replace("\n","") for i in R.readlines()]


punctuations = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '.', '/', ':', ';', '<', '=', '>', '?', '@'
             , '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~']


