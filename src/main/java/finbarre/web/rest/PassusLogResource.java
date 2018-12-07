package finbarre.web.rest;

import com.codahale.metrics.annotation.Timed;
import finbarre.domain.PassusLog;
import finbarre.service.PassusLogService;
import finbarre.web.rest.errors.BadRequestAlertException;
import finbarre.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing PassusLog.
 */
@RestController
@RequestMapping("/api")
public class PassusLogResource {

    private final Logger log = LoggerFactory.getLogger(PassusLogResource.class);

    private static final String ENTITY_NAME = "passusLog";

    private final PassusLogService passusLogService;

    public PassusLogResource(PassusLogService passusLogService) {
        this.passusLogService = passusLogService;
    }

    /**
     * POST  /passus-logs : Create a new passusLog.
     *
     * @param passusLog the passusLog to create
     * @return the ResponseEntity with status 201 (Created) and with body the new passusLog, or with status 400 (Bad Request) if the passusLog has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/passus-logs")
    @Timed
    public ResponseEntity<PassusLog> createPassusLog(@Valid @RequestBody PassusLog passusLog) throws URISyntaxException {
        log.debug("REST request to save PassusLog : {}", passusLog);
        if (passusLog.getId() != null) {
            throw new BadRequestAlertException("A new passusLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PassusLog result = passusLogService.save(passusLog);
        return ResponseEntity.created(new URI("/api/passus-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /passus-logs : Updates an existing passusLog.
     *
     * @param passusLog the passusLog to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated passusLog,
     * or with status 400 (Bad Request) if the passusLog is not valid,
     * or with status 500 (Internal Server Error) if the passusLog couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/passus-logs")
    @Timed
    public ResponseEntity<PassusLog> updatePassusLog(@Valid @RequestBody PassusLog passusLog) throws URISyntaxException {
        log.debug("REST request to update PassusLog : {}", passusLog);
        if (passusLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PassusLog result = passusLogService.save(passusLog);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, passusLog.getId().toString()))
            .body(result);
    }

    /**
     * GET  /passus-logs : get all the passusLogs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of passusLogs in body
     */
    @GetMapping("/passus-logs")
    @Timed
    public List<PassusLog> getAllPassusLogs() {
        log.debug("REST request to get all PassusLogs");
        return passusLogService.findAll();
    }

    /**
     * GET  /passus-logs/:id : get the "id" passusLog.
     *
     * @param id the id of the passusLog to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the passusLog, or with status 404 (Not Found)
     */
    @GetMapping("/passus-logs/{id}")
    @Timed
    public ResponseEntity<PassusLog> getPassusLog(@PathVariable String id) {
        log.debug("REST request to get PassusLog : {}", id);
        Optional<PassusLog> passusLog = passusLogService.findOne(id);
        return ResponseUtil.wrapOrNotFound(passusLog);
    }

    /**
     * DELETE  /passus-logs/:id : delete the "id" passusLog.
     *
     * @param id the id of the passusLog to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/passus-logs/{id}")
    @Timed
    public ResponseEntity<Void> deletePassusLog(@PathVariable String id) {
        log.debug("REST request to delete PassusLog : {}", id);
        passusLogService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
