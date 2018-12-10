package finbarre.web.rest;

import com.codahale.metrics.annotation.Timed;
import finbarre.domain.PassusLog;
import finbarre.service.PassusLogService;
import finbarre.service.impl.ConvertLog;
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
 * REST controller for managing ConvertLog.
 */
@RestController
@RequestMapping("/api")
public class ConvertLogResource {

	private final Logger log = LoggerFactory.getLogger(ConvertLogResource.class);

	private static final String ENTITY_NAME = "passusLog";

	private final PassusLogService passusLogService;

	public ConvertLogResource(PassusLogService passusLogService) {
		this.passusLogService = passusLogService;
	}

	/**
	 * PUT /passus-logs : Updates an existing passusLog.
	 *
	 * @param passusLog the passusLog to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         passusLog, or with status 400 (Bad Request) if the passusLog is not
	 *         valid, or with status 500 (Internal Server Error) if the passusLog
	 *         couldn't be updated
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PutMapping("/convert-log")
	@Timed
	public ResponseEntity<PassusLog> updatePassusLog(@Valid @RequestBody PassusLog passusLog)
			throws URISyntaxException {
		log.debug("REST request to convert PassusLog : {}", passusLog);
		if (passusLog.getId() == null) {
			throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
		}

		ConvertLog convertLog = new ConvertLog();
		passusLog = convertLog.convertStatus(passusLog);

		PassusLog result = passusLogService.save(passusLog);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, passusLog.getId().toString())).body(result);
	}

}
