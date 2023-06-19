import promotional
import official
import subjectRandom

#open files
f = open('finalMessage.html', 'wb')
header_reader = open('./defaults/header.html', 'rb')
footer_reader = open('./defaults/footer.html','rb')

def randomize(r):
    if r == 0:
        print "Type: Promotional email"
        f1 = open('./templates/promotional/content.html','r')
        contents = f1.read()
        f.write(contents)
        f1.close()
    elif r == 1:
        print "Type: Hero email"
        #f1 = open('./templates/hero/content.html','r')
        f1 = open('./templates/promotional/content.html','r')
        contents = f1.read()
        f.write(contents)
        f1.close()
    elif r == 2:
        print "Type: Official email"
        f1 = open('./templates/official/content.html','r')
        contents = f1.read()
        f.write(contents)
        f1.close()
    elif r == 3:
        print "Type: Alert email"
        #f1 = open('./templates/alert/content.html','r')
        f1 = open('./templates/official/content.html','r')
        contents = f1.read()
        f.write(contents)
        f1.close()
    else:
        print "Out of range!"

def assemble():

    #add header
    header = header_reader.read()
    f.write(header)

    #get random subject line
    subject = subjectRandom.getRandomSubject(1)
    print "Subject: " + subject

    #randomize message content
    from random import randint
    randomize(randint(0,3))

    #add footer
    footer = footer_reader.read()
    f.write(footer)
    
    print "Successfully added!"
    f.close()

assemble();
#randomize()
