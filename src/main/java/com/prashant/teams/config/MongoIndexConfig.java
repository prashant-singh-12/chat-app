package com.prashant.teams.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Collation;
import com.mongodb.client.model.CollationStrength;
import com.mongodb.client.model.IndexOptions;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoIndexConfig implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    public MongoIndexConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) throws Exception {

            MongoCollection<Document> userCollection = mongoTemplate.getCollection("users");
            Collation collation=Collation.builder().locale("en")
                    .collationStrength(CollationStrength.SECONDARY)
                                .build();

            Document doc=new Document("email",1);

            IndexOptions options=new IndexOptions()
                    .name("email_ci_index")     //email case insensitive index
                    .unique(true)
                    .collation(collation);


            userCollection.createIndex(doc,options);
    }
}
