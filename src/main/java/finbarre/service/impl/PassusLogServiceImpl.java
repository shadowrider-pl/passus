package finbarre.service.impl;

import finbarre.service.PassusLogService;
import finbarre.domain.PassusLog;
import finbarre.repository.PassusLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing PassusLog.
 */
@Service
public class PassusLogServiceImpl implements PassusLogService {

    private final Logger log = LoggerFactory.getLogger(PassusLogServiceImpl.class);

    private final PassusLogRepository passusLogRepository;

    public PassusLogServiceImpl(PassusLogRepository passusLogRepository) {
        this.passusLogRepository = passusLogRepository;
    }

    /**
     * Save a passusLog.
     *
     * @param passusLog the entity to save
     * @return the persisted entity
     */
    @Override
    public PassusLog save(PassusLog passusLog) {
        log.debug("Request to save PassusLog : {}", passusLog);
        return passusLogRepository.save(passusLog);
    }

    /**
     * Get all the passusLogs.
     *
     * @return the list of entities
     */
    @Override
    public List<PassusLog> findAll() {
        log.debug("Request to get all PassusLogs");
        return passusLogRepository.findAll();
    }


    /**
     * Get one passusLog by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    public Optional<PassusLog> findOne(String id) {
        log.debug("Request to get PassusLog : {}", id);
        return passusLogRepository.findById(id);
    }

    /**
     * Delete the passusLog by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete PassusLog : {}", id);
        passusLogRepository.deleteById(id);
    }
}
