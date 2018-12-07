package finbarre.repository;

import finbarre.domain.PassusLog;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the PassusLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PassusLogRepository extends MongoRepository<PassusLog, String> {

}
