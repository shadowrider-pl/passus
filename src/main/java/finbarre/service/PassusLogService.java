package finbarre.service;

import finbarre.domain.PassusLog;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing PassusLog.
 */
public interface PassusLogService {

    /**
     * Save a passusLog.
     *
     * @param passusLog the entity to save
     * @return the persisted entity
     */
    PassusLog save(PassusLog passusLog);

    /**
     * Get all the passusLogs.
     *
     * @return the list of entities
     */
    List<PassusLog> findAll();


    /**
     * Get the "id" passusLog.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<PassusLog> findOne(String id);

    /**
     * Delete the "id" passusLog.
     *
     * @param id the id of the entity
     */
    void delete(String id);
}
