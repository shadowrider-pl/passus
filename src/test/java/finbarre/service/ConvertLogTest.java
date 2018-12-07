package finbarre.service;

import finbarre.domain.PassusLog;
import finbarre.repository.PassusLogRepository;
import finbarre.service.PassusLogService;
import finbarre.service.impl.ConvertLog;
import finbarre.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static finbarre.web.rest.TestUtil.sameInstant;
import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PassusLogResource REST controller.
 *
 * @see PassusLogResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ConvertLog.class)
public class ConvertLogTest {


    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";

    private static final String DEFAULT_VALUE = "VVVVVVVVVVVV";
    private static final String UPDATED_VALUE = DEFAULT_VALUE+" [STATUS= CHECKED]";


    private PassusLog passusLog;


    /**
     * Create an entity for this test.
     */
    public static PassusLog createEntity() {
        PassusLog passusLog = new PassusLog()
            .time(DEFAULT_TIME)
            .name(DEFAULT_NAME)
            .value(DEFAULT_VALUE);
        return passusLog;
    }


    @Before
    public void initTest() {
        passusLog = createEntity();
    }
    
    @Test
    public void convertTest() throws Exception {
    	ConvertLog convertLog = new ConvertLog();
    	passusLog=convertLog.convert(passusLog);
    assertThat(passusLog.getTime()).isEqualTo(DEFAULT_TIME);
    assertThat(passusLog.getName()).isEqualTo(DEFAULT_NAME);
    assertThat(passusLog.getValue()).isEqualTo(UPDATED_VALUE);
    }

}
